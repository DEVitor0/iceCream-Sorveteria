const { createPreference, getPayment } = require('../../../utils/validation/mercadopagoUtils');
const Coupon = require('../../../model/couponModel');
const Product = require('../../../model/productModel');
const Order = require('../../../model/orderModel');
const ApiError = require('../../../utils/ApiError');
const mongoose = require('mongoose');

exports.createPaymentPreference = async (req, res, next) => {
  // Verificação inicial da configuração
  console.log('=== INÍCIO DA CRIAÇÃO DE PREFERÊNCIA ===');
  console.log('Verificando configuração do Mercado Pago...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Token:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Presente' : 'Ausente');
  console.log('Integrator ID:', process.env.MERCADOPAGO_INTEGRATOR_ID || 'Não configurado');

  try {
    const { items, couponCode } = req.body;
    const user = req.user;

    console.log('Dados recebidos:', {
      itemsCount: items?.length,
      couponCode: couponCode || 'Nenhum',
      userId: user._id
    });

    // 1. Validação básica dos itens
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Erro: Carrinho vazio');
      throw new ApiError(400, 'Carrinho de compras vazio');
    }

    // 2. Verificar produtos no banco de dados
    console.log('Buscando produtos no banco de dados...');
    const products = await Product.find({
      _id: { $in: items.map(i => i.productId) }
    });

    if (products.length !== items.length) {
      const missingProducts = items.filter(item =>
        !products.some(p => p._id.toString() === item.productId)
      );
      console.log('Produtos faltantes:', missingProducts);
      throw new ApiError(404, 'Alguns produtos não foram encontrados', {
        missingProducts: missingProducts.map(p => p.productId)
      });
    }

    // 3. Verificar estoque e preparar itens
    console.log('Verificando estoque e preparando itens...');
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
      console.log('Itens sem estoque:', outOfStockItems);
      throw new ApiError(409, 'Alguns produtos estão com estoque insuficiente', {
        outOfStockItems
      });
    }

    // 4. Aplicar cupom se existir
    console.log('Verificando cupom...');
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
        console.log('Cupom aplicado:', couponDetails);
      }
    }

    // 5. Criar pedido no banco de dados
    console.log('Criando pedido no banco de dados...');
    const order = await this.createOrderFromCart(user._id, items, couponCode, total, discountApplied);
    console.log('Pedido criado:', order._id);

    // 6. Criar preferência de pagamento
    console.log('Preparando preferência de pagamento...');
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
      },
      binary_mode: true // Adicionado para evitar pagamentos pendentes
    };

    console.log('Dados completos da preferência:', {
      total,
      discountApplied,
      itemsCount: preparedItems.length,
      orderId: order._id
    });

    // Criar preferência no Mercado Pago
    console.log('Enviando para o Mercado Pago...');
    const response = await createPreference(preference);
    console.log('Resposta do Mercado Pago:', {
      id: response.id,
      status: response.status,
      init_point: response.init_point ? 'Gerado' : 'Não gerado'
    });

    // 7. Atualizar pedido com ID da preferência
    order.paymentPreferenceId = response.id;
    await order.save();
    console.log('Pedido atualizado com preferenceId:', response.id);

    res.json({
      success: true,
      initPoint: response.init_point,
      preferenceId: response.id,
      orderId: order._id
    });

  } catch (error) {
    console.error('ERRO DETALHADO:', {
      message: error.message,
      stack: error.stack,
      status: error.status,
      cause: error.cause,
      timestamp: new Date().toISOString()
    });

    if (error.response?.data) {
      console.error('Resposta do Mercado Pago:', error.response.data);
    }

    next(error);
  } finally {
    console.log('=== FIM DO PROCESSO DE PREFERÊNCIA ===');
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
        paymentId: 'pending_' + new mongoose.Types.ObjectId(), // ID temporário
        status: 'pending',
        paymentMethod: 'mercadopago', // Definindo como mercado pago
        paymentType: 'credit_card', // Tipo padrão
        totalPaid: totalAmount, // Mesmo valor do totalAmount inicial
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

    const payment = await getPayment(id);
    const paymentData = payment;

    const [orderId ] = paymentData.external_reference.split('-');

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, 'ID do pedido inválido');
    }

    let order = await Order.findOne({ _id: orderId }).session(session);
    if (!order) {
      throw new ApiError(404, 'Pedido não encontrado');
    }

    order.payment.status = paymentData.status;
    order.status = this.mapPaymentStatus(paymentData.status);

    if (paymentData.status === 'approved' || paymentData.status === 'completed') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) {
          throw new ApiError(404, `Produto ${item.productId} não encontrado`);
        }

        if (product.quantity < item.quantity) {
          throw new ApiError(409, `Estoque insuficiente para o produto ${product.name}`);
        }
      }

      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { quantity: -item.quantity } },
          { session }
        );

        console.log(`Subtraído ${item.quantity} unidades do produto ${item.productId}`);
      }

      if (order.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: order.couponCode },
          { $inc: { currentUses: 1 } },
          { session }
        );
      }

      order.payment.approvedAt = new Date();
      order.status = 'completed';
    }

    await order.save({ session });
    await session.commitTransaction();

    res.status(200).send('OK');
  } catch (error) {
    await session.abortTransaction();
    console.error('Erro no webhook:', {
      error: error.message,
      stack: error.stack,
      paymentId: req.query.id,
      timestamp: new Date().toISOString()
    });
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
