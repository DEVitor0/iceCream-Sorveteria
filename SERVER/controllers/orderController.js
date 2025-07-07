const Order = require('../model/orderModel');
const ApiError = require('../utils/ApiError');

exports.getCompletedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: 'completed',
      deliveryStatus: 'preparing'
    })
    .populate({
      path: 'userId',
      select: 'name email'
    })
    .populate({
      path: 'items.productId',
      select: 'name price imageUrl description'
    })
    .sort({ createdAt: -1 });

    if (!orders) {
      return next(new ApiError(404, 'Nenhum pedido encontrado'));
    }

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(new ApiError(500, 'Erro ao buscar pedidos completos'));
  }
};

exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Status de entrega inválido');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Pedido não encontrado');
    }

    // Validação do fluxo do restaurante
    if (status === 'ready_for_pickup' && order.deliveryStatus !== 'preparing') {
      throw new ApiError(400, 'O pedido precisa estar em preparação para ser marcado como pronto');
    }

    if (status === 'out_for_delivery' && order.deliveryStatus !== 'ready_for_pickup') {
      throw new ApiError(400, 'O pedido precisa estar pronto para ser retirado pelo entregador');
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { deliveryStatus: status },
      { new: true }
    ).populate('userId', 'name email');

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, startDate, endDate, userId, deliveryStatus } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (deliveryStatus) {
      filter.deliveryStatus = deliveryStatus;
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate)
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate)
      };
    }

    if (userId) {
      filter.userId = userId;
    }

    const orders = await Order.find(filter)
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'items.productId',
        select: 'name price imageUrl'
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(new ApiError(500, 'Erro ao buscar pedidos'));
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email phone'
      })
      .populate({
        path: 'items.productId',
        select: 'name price imageUrl description category'
      });

    if (!order) {
      return next(new ApiError(404, 'Pedido não encontrado'));
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(new ApiError(500, 'Erro ao buscar detalhes do pedido'));
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed'];

    if (!validStatuses.includes(status)) {
      return next(new ApiError(400, 'Status inválido'));
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('userId', 'name email')
    .populate('items.productId', 'name price');

    if (!order) {
      return next(new ApiError(404, 'Pedido não encontrado'));
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(new ApiError(500, 'Erro ao atualizar status do pedido'));
  }
};
