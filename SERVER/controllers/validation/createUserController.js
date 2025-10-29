const User = require('../../model/userModel');
const TwoFACode = require('../../model/twoFAModel');
const generateTwoFACode = require('../../configs/security/twoFAGenerateCode');
const sendTwoFACodeEmail = require('../../utils/others/mailers/twoFASendEmail');
const ApiError = require('../../utils/ApiError');

async function initiateUserCreation(req, res, next) {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      throw new ApiError(400, 'E-mail e nome completo são obrigatórios');
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'Usuário já existe com este e-mail');
    }

    // Verificar se já existe código 2FA recente
    const existingCode = await TwoFACode.findOne({ email });
    if (existingCode) {
      const now = new Date();
      const codeAge = (now - existingCode.createdAt) / 1000;
      if (codeAge < 30) {
        throw new ApiError(429, 'Um código já foi enviado recentemente. Aguarde 30 segundos.');
      }
      await TwoFACode.deleteOne({ email });
    }

    // Gerar e salvar código 2FA
    const code = generateTwoFACode();
    const twoFADoc = new TwoFACode({ email, code });
    await twoFADoc.save();

    // Enviar e-mail com código 2FA
    await sendTwoFACodeEmail(email, code);

    res.status(200).json({
      success: true,
      message: 'Código 2FA enviado para o e-mail para confirmar criação da conta'
    });

  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { email, fullName, password, addresses } = req.body;

    // Validar dados obrigatórios
    if (!email || !fullName || !password) {
      throw new ApiError(400, 'E-mail, nome completo e senha são obrigatórios');
    }

    // Criar novo usuário
    const newUser = new User({
      email,
      fullName,
      password,
      addresses: addresses || [],
      provider: 'local',
      role: 'user' // Definir role padrão como 'user'
    });

    await newUser.save();

    // Remover password da resposta
    const userResponse = { ...newUser.toObject() };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: userResponse
    });

  } catch (error) {
    if (error.code === 11000) {
      next(new ApiError(409, 'Usuário já existe com este e-mail'));
    } else if (error.name === 'ValidationError') {
      next(new ApiError(400, Object.values(error.errors).map(e => e.message).join(', ')));
    } else {
      next(error);
    }
  }
}

module.exports = { initiateUserCreation, createUser };
