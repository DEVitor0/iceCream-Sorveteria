const TwoFACode = require('../model/twoFAModel');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const generateTwoFACode = require('../configs/twoFAGenerateCode');
const sendTwoFACodeEmail = require('../utils/twoFASendEmail');

async function twoFALogin(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'O e-mail é obrigatório'
    });
  }

  try {
    const existingCode = await TwoFACode.findOne({ email });

    if (existingCode) {
      const now = new Date();
      const codeAge = (now - existingCode.createdAt) / 1000;

      if (codeAge < 30) {
        return res.status(429).json({
          success: false,
          message: 'Um código já foi enviado recentemente. Por favor, aguarde.'
        });
      }

      await TwoFACode.deleteOne({ email });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const code = generateTwoFACode();
    console.log(`Gerando código 2FA ${code} para ${email}`);

    const twoFADoc = new TwoFACode({
      email,
      code
    });
    await twoFADoc.save();

    await sendTwoFACodeEmail(email, code);
    console.log(`E-mail enviado para ${email}`);

    res.status(200).json({
      success: true,
      message: 'Código 2FA enviado para o seu e-mail.'
    });

  } catch (error) {
    console.error('Erro no processo de login 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar o login.',
      error: error.message
    });
  }
}

async function validateTwoFACode(req, res) {
  console.log('Recebendo requisição de validação 2FA:', req.body);

  const { email, code } = req.body;

  if (!email || !code) {
      console.log('Dados incompletos recebidos:', { email, code });
      return res.status(400).json({
          success: false,
          message: 'E-mail e código são obrigatórios'
      });
  }

  try {
      console.log(`Validando código para ${email}`);
      const [savedCode, user] = await Promise.all([
          TwoFACode.findOne({ email }),
          User.findOne({ email })
      ]);

      if (!user) {
          console.log(`Usuário não encontrado: ${email}`);
          return res.status(404).json({
              success: false,
              message: 'Usuário não encontrado'
          });
      }

      if (!savedCode) {
          console.log(`Nenhum código encontrado para: ${email}`);
          return res.status(400).json({
              success: false,
              message: 'Código 2FA não encontrado'
          });
      }

      if (savedCode.code !== code) {
          console.log(`Código inválido para ${email}. Esperado: ${savedCode.code}, Recebido: ${code}`);
          return res.status(400).json({
              success: false,
              message: 'Código 2FA inválido'
          });
      }

      const now = new Date();
      const codeAge = (now - savedCode.createdAt) / 1000 / 60;
      if (codeAge > 10) {
          console.log(`Código expirado para ${email}. Idade: ${codeAge} minutos`);
          return res.status(400).json({
              success: false,
              message: 'Código 2FA expirado'
          });
      }

      const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '168h' }
      );

      await TwoFACode.deleteOne({ email });
      console.log(`Código validado com sucesso para ${email}`);

      res.cookie('jwt', token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 604800000,
          path: '/',
      }).status(200).json({
          success: true,
          user: {
              id: user._id,
              email: user.email,
              role: user.role
          }
      });

  } catch (error) {
      console.error('Erro na validação 2FA:', error);
      res.status(500).json({
          success: false,
          message: 'Erro ao validar o código 2FA',
          error: error.message
      });
  }
}

module.exports = { twoFALogin, validateTwoFACode };
