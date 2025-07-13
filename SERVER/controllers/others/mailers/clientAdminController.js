const User = require('../../../model/userModel');
const Order = require('../../../model/orderModel');
const ApiError = require('../../../utils/ApiError');
const emailService = require('../../../utils/others/mailers/emailService');

exports.getAllClients = async (req, res, next) => {
  try {
    const clients = await User.find({ role: 'user' })
      .select('fullName email photo lastLogin role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(new ApiError(500, 'Erro ao buscar clientes'));
  }
};

exports.getClientDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('fullName email photo lastLogin addresses createdAt');

    if (!user) {
      return next(new ApiError(404, 'Cliente não encontrado'));
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.productId',
        select: 'name price images category'
      });

    res.json({
      success: true,
      data: {
        user,
        orders
      }
    });
  } catch (error) {
    next(new ApiError(500, 'Erro ao buscar detalhes do cliente'));
  }
};

exports.sendEmailToClient = async (req, res, next) => {
  try {
    const { userId, subject, message } = req.body;

    if (!userId || !subject || !message) {
      return next(new ApiError(400, 'Dados incompletos para envio de email'));
    }

    const user = await User.findById(userId).select('email fullName');
    if (!user) {
      return next(new ApiError(404, 'Cliente não encontrado'));
    }

    try {
      await emailService.sendEmail({
        email: user.email,
        subject,
        message,
        template: 'promocao',
        context: {
          name: user.fullName,
          promotionTitle: subject,
          promotionDescription: message
        }
      });

      res.json({
        success: true,
        message: 'Email enviado com sucesso'
      });
    } catch (error) {
      console.error('Erro no envio de email:', error);
      throw new ApiError(500, 'Erro ao processar o envio do email');
    }

  } catch (error) {
    console.error('Erro no sendEmailToClient:', error);
    next(error instanceof ApiError ? error : new ApiError(500, 'Erro ao enviar email'));
  }
};

exports.searchClients = async (req, res, next) => {
  try {
    const { search, startDate, endDate, sortBy, sortOrder } = req.query;

    let query = { role: 'user' };
    let sortOptions = { createdAt: -1 };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (sortBy) {
      sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    }

    const clients = await User.find(query)
      .select('fullName email photo lastLogin role createdAt')
      .sort(sortOptions);

    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(new ApiError(500, 'Erro ao buscar clientes'));
  }
};
