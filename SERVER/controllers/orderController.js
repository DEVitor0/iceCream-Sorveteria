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
      select: 'name price imageUrl description' // Adicione mais campos se necessário
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
