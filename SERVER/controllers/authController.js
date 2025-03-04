const { generateToken } = require('../utils/auth');
const User = require('../model/userModel');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Forneça usuário e senha'
      });
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const token = generateToken(user);

    res.status(200)
      .cookie('jwt', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? 'seusite.com' : 'localhost'
      })
      .json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Usuário já está em uso'
      });
    }

    const newUser = await User.create({
      username,
      password
    });

    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

module.exports = { login, register };
