const { createPreference, getPayment } = require('../utils/mercadopagoUtils');
const Coupon = require('../model/couponModel');
const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

exports.createPaymentPreference = async (req, res, next) => {
  try {
    const { items, couponCode } = req.body;
    const user = req.user;

    // 1. Validação básica dos itens
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'Carrinho de compras vazio');
    }

    // 2. Verificar produtos no banco de dados
    const products = await Product.find({
      _id: { $in: items.map(i => i.productId) }
    });

    if (products.length !== items.length) {
      const missingProducts = items.filter(item =>
        !products.some(p => p._id.toString() === item.productId)
      );
      throw new ApiError(404, 'Alguns produtos não foram encontrados', {
        missingProducts: missingProducts.map(p => p.productId)
      });
    }

    // 3. Verificar estoque e preparar itens
    let total = 0;
    const outOfStockItems = [];
    const preparedItems = products.map(product => {
      const item = items.find(i => i.productId === product._id.toString());

      if (product.quantity < item.quantity) {
        outOfStockItems.push({
          productId: product._id,
          name: product.name,
          available: product.quantity,
          requested: item.quantity
        });
      }

      total += product.price * item.quantity;

      return {
        id: product._id,
        title: product.name,
        unit_price: product.price,
        quantity: item.quantity,
        picture_url: product.webImageUrl || product.imageUrl || '',
        description: product.description || ''
      };
    });

    if (outOfStockItems.length > 0) {
      throw new ApiError(409, 'Alguns produtos estão com estoque insuficiente', {
        outOfStockItems
      });
    }

    // 4. Aplicar cupom se existir
    let discountApplied = 0;
    let couponDetails = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon) {
        couponDetails = {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        };

        discountApplied = coupon.discountType === 'percentage'
          ? total * (coupon.discountValue / 100)
          : Math.min(coupon.discountValue, total);

        total = Math.max(0, total - discountApplied);
      }
    }

    // 5. Criar pedido no banco de dados
    const order = await this.createOrderFromCart(user._id, items, couponCode, total, discountApplied);

    // 6. Criar preferência de pagamento usando a função utilitária
    const preference = {
      items: preparedItems,
      payer: {
        name: user.name,
        email: user.email,
        ...(user.address && {
          address: {
            zip_code: user.address.zipCode || '',
            street_name: user.address.street || '',
            street_number: user.address.number || '',
            neighborhood: user.address.neighborhood || '',
            city: user.address.city || '',
            federal_unit: user.address.state || ''
          }
        })
      },
      external_reference: `ORDER-${order._id}-${user._id}`,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment/success?order_id=${order._id}`,
        failure: `${process.env.FRONTEND_URL}/payment/failure?order_id=${order._id}`,
        pending: `${process.env.FRONTEND_URL}/payment/pending?order_id=${order._id}`
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [{ id: 'amex' }],
        installments: 6,
        default_installments: 1
      },
      notification_url: `${process.env.BACKEND_URL}/payment/webhook`,
      statement_descriptor: 'LOJA*MERCADOPAGO',
      metadata: {
        order_id: order._id.toString(),
        user_id: user._id.toString(),
        ...(couponDetails && { coupon: couponDetails })
      }
    };

    // Usando a função utilitária para criar a preferência
    const response = await createPreference(preference);

    // 7. Atualizar pedido com ID da preferência
    order.paymentPreferenceId = response.id;
    await order.save();

    res.json({
      success: true,
      initPoint: response.init_point,
      preferenceId: response.id,
      orderId: order._id
    });

  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    next(error);
  }
};

exports.createOrderFromCart = async (userId, items, couponCode, totalAmount, discountApplied) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const products = await Product.find({
      _id: { $in: items.map(i => i.productId) }
    }).session(session);

    if (products.length !== items.length) {
      throw new ApiError(400, 'Alguns produtos não foram encontrados');
    }

    const orderItems = products.map(product => {
      const item = items.find(i => i.productId === product._id.toString());
      return {
        productId: product._id,
        quantity: item.quantity,
        unitPrice: product.price,
        name: product.name,
        imageUrl: product.webImageUrl || product.imageUrl || '',
        originalPrice: product.price,
        originalStock: product.quantity
      };
    });

    const [order] = await Order.create([{
      userId,
      items: orderItems,
      totalAmount,
      discountApplied,
      couponCode: couponCode || undefined,
      status: 'pending',
      payment: {
        status: 'pending',
        gateway: 'mercadopago'
      }
    }], { session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.handleWebhook = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, topic } = req.query;

    if (topic !== 'payment') {
      return res.status(200).send('Notificação não relacionada a pagamento');
    }

    // Usando a função utilitária para obter o pagamento
    const payment = await getPayment(id);
    const paymentData = payment;

    // Extrair informações do pedido
    const [, orderId, userId] = paymentData.external_reference.split('-');

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, 'ID do pedido inválido');
    }

    // Buscar pedido
    let order = await Order.findOne({ _id: orderId }).session(session);
    if (!order) {
      order = await Order.create([{
        userId,
        items: [],
        totalAmount: paymentData.transaction_amount,
        status: this.mapPaymentStatus(paymentData.status),
        payment: {
          paymentId: paymentData.id.toString(),
          status: paymentData.status,
          paymentMethod: paymentData.payment_method_id,
          paymentType: paymentData.payment_type_id,
          installments: paymentData.installments,
          totalPaid: paymentData.transaction_amount,
          transactionDetails: paymentData.transaction_details,
          mercadoPagoResponse: paymentData,
          gateway: 'mercadopago'
        }
      }], { session });
      order = order[0];
    }

    // Atualizar status
    order.payment.status = paymentData.status;
    order.status = this.mapPaymentStatus(paymentData.status);

    // Processar pagamento aprovado
    if (paymentData.status === 'approved') {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { quantity: -item.quantity } },
          { session }
        );
      }

      if (order.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: order.couponCode },
          { $inc: { currentUses: 1 } },
          { session }
        );
      }

      order.payment.approvedAt = new Date();
    }

    await order.save({ session });
    await session.commitTransaction();

    res.status(200).send('OK');
  } catch (error) {
    await session.abortTransaction();
    console.error('Erro no webhook:', error);
    next(error);
  } finally {
    session.endSession();
  }
};

exports.mapPaymentStatus = function(mercadoPagoStatus) {
  const statusMap = {
    pending: 'pending',
    approved: 'completed',
    rejected: 'failed',
    refunded: 'refunded',
    cancelled: 'cancelled',
    in_process: 'processing',
    charged_back: 'refunded'
  };
  return statusMap[mercadoPagoStatus] || 'pending';
};

exports.getOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, 'ID do pedido inválido');
    }

    const order = await Order.findById(orderId)
      .select('-payment.mercadoPagoResponse -items._id');

    if (!order) {
      throw new ApiError(404, 'Pedido não encontrado');
    }

    res.json({
      success: true,
      status: order.status,
      paymentStatus: order.payment.status,
      updatedAt: order.updatedAt,
      canRetry: order.status === 'failed'
    });
  } catch (error) {
    next(error);
  }
};
