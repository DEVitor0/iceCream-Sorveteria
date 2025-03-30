const TwoFACodeModel = require('../model/twoFAModel');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const generateTwoFACode = require('../configs/twoFAGenerateCode');
const sendTwoFACodeEmail = require('../utils/twoFASendEmail');

async function twoFALogin(req, res) {
    const { email } = req.body;

    try {
        const code = generateTwoFACode();

        await TwoFACodeModel.findOneAndUpdate(
            { email },
            { code },
            { upsert: true, new: true }
        );

        sendTwoFACodeEmail(email, code);

        res.status(200).json({ message: 'Código 2FA enviado para o seu e-mail.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao processar o login.' });
    }
}

async function validateTwoFACode(req, res) {
  const { email, code } = req.body;

  try {
    const savedCode = await TwoFACodeModel.findOne({ email });
    const user = await User.findOne({ username: email });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (!savedCode || savedCode.code !== code) {
      return res.status(400).json({ message: 'Código 2FA inválido.' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await TwoFACodeModel.deleteOne({ email });

    res.cookie('jwt', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000,
      path: '/',
    }).status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao validar o código 2FA.' });
  }
}

module.exports = { twoFALogin, validateTwoFACode };
