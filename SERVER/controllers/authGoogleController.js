const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const handleGoogleAuth = async (req, res) => {
  try {
      const { sub, name, email, picture } = req.body;

      let user = await User.findOne({ email });

      if (user) {
          if (!user.googleSub) {
              return res.status(409).json({
                  success: false,
                  message: 'Este email já está cadastrado com outro método de autenticação'
              });
          }

          if (user.googleSub !== sub) {
              return res.status(409).json({
                  success: false,
                  message: 'Este email já está associado a outra conta Google'
              });
          }
      }

      if (!user) {
          let photoPath = '';
          if (picture) {
              const uploadDir = path.join(__dirname, '../uploads/userPhotos');
              if (!fs.existsSync(uploadDir)) {
                  fs.mkdirSync(uploadDir, { recursive: true });
              }

              const response = await axios.get(picture, { responseType: 'stream' });
              const fileName = `user_${sub}_${Date.now()}${path.extname(picture).split('?')[0]}`;
              photoPath = path.join(uploadDir, fileName);

              const writer = fs.createWriteStream(photoPath);
              response.data.pipe(writer);

              await new Promise((resolve, reject) => {
                  writer.on('finish', resolve);
                  writer.on('error', reject);
              });
          }

          user = new User({
              googleSub: sub,
              fullName: name,
              email,
              photo: picture,
              provider: 'google'
          });

          await user.save();
      }

      // Atualiza o último login
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
      );

      res.cookie('jwt', token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: 'lax',
          path: '/',
      });

      res.status(200).json({
          success: true,
          user: {
              id: user._id,
              fullName: user.fullName,
              email: user.email,
              photo: user.photo,
              role: user.role,
              lastLogin: user.lastLogin // Opcional: retornar na resposta
          }
      });

  } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ success: false, message: 'Erro na autenticação com Google' });
  }
};

module.exports = { handleGoogleAuth };
