const User = require('../../../model/userModel');
const ApiError = require('../../../utils/ApiError');

// Listar todos os usuários (com paginação opcional)
exports.getAllUsers = async (req, res, next) => {
  try {
    // Paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtros opcionais
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.search) {
      filter.$or = [
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -googleSub -__v')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new ApiError(500, 'Erro ao buscar usuários'));
  }
};

// Atualizar role de um usuário
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'moder'].includes(role)) {
      throw new ApiError(400, 'Role inválida');
    }

    // Verificar se o usuário que está fazendo a requisição é admin
    if (req.user.role !== 'admin') {
      throw new ApiError(403, 'Acesso negado. Somente administradores podem alterar roles');
    }

    // Verificar se está tentando modificar a si mesmo
    if (userId === req.user.id) {
      throw new ApiError(400, 'Você não pode modificar sua própria role');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password -googleSub -__v');

    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado');
    }

    res.json({
      success: true,
      message: 'Role atualizada com sucesso',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Obter informações do usuário atual
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -googleSub -__v');

    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado');
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
