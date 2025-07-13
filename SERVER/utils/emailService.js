const nodemailer = require('nodemailer');
const emailConfig = require('../configs/emailConfig');
const User = require('../model/userModel');
const path = require('path');
const fs = require('fs').promises;

const DEFAULT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { margin-top: 20px; padding: 20px; text-align: center; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{subject}}</h1>
        </div>
        <div class="content">
            <p>Olá {{name}},</p>
            <p>{{message}}</p>
            <p>Atenciosamente,</p>
            <p>Equipe {{companyName}}</p>
        </div>
        <div class="footer">
            <p>© {{year}} {{companyName}}. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>
`;


class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: emailConfig.auth,
      pool: true,
      rateLimit: true,
      maxConnections: 5,
      maxMessages: 100
    });
  }

  async loadTemplate(templateName, replacements = {}) {
    try {
      // Tenta carregar o template personalizado
      const templatePath = path.join(__dirname, '../mail', `${templateName}.html`);

      try {
        let html = await fs.readFile(templatePath, 'utf8');
        return this.replacePlaceholders(html, replacements);
      } catch (error) {
        console.warn(`Template ${templateName} não encontrado, usando padrão`);
        return this.replacePlaceholders(DEFAULT_TEMPLATE, replacements);
      }
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      return this.replacePlaceholders(DEFAULT_TEMPLATE, replacements);
    }
  }

  replacePlaceholders(html, replacements) {
    const defaultReplacements = {
      companyName: "Ice Cream Sorveteria",
      year: new Date().getFullYear(),
      ...replacements
    };

    let result = html;
    Object.keys(defaultReplacements).forEach(key => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), defaultReplacements[key]);
    });

    return result;
  }


  async sendEmail(options) {
    try {
      const { email, subject, message, template = 'default', context = {} } = options;

      const html = await this.loadTemplate(template, {
        ...context,
        message,
        subject,
        name: context.name || 'Cliente'
      });

      const mailOptions = {
        from: emailConfig.defaultFrom,
        to: email,
        subject,
        html,
        headers: {
          'X-Mailer': 'IceCream-Sorveteria-API',
          'X-Priority': '1'
        }
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado para ${email} - Message-ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', {
        error: error.message,
        stack: error.stack
      });
      throw new Error('Falha no envio de email');
    }
  }

  async sendBulkEmails(emails, subject, htmlTemplate, replacements = {}, batchSize = 50) {
    try {
      const batches = [];
      for (let i = 0; i < emails.length; i += batchSize) {
        batches.push(emails.slice(i, i + batchSize));
      }

      for (const [index, batch] of batches.entries()) {
        console.log(`Processando batch ${index + 1}/${batches.length}`);

        const promises = batch.map(async email => {
          const personalizedHtml = await this.loadTemplate(htmlTemplate, {
            ...replacements,
            email,
            companyName: "Ice Cream Sorveteria",
            year: new Date().getFullYear(),
            unsubscribeLink: `LINK PARA MIM FAZER DEPOIS`
          });

          return this.sendEmail(email, subject, personalizedHtml);
        });

        await Promise.all(promises);

        if (index < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, emailConfig.rateLimit.delayBetweenBatches));
        }
      }
      return { success: true, message: 'Emails enviados com sucesso' };
    } catch (error) {
      console.error('Erro no sendBulkEmails:', error);
      throw error;
    }
  }

  async getAllUserEmails() {
    try {
      const users = await User.find({}, 'email');
      return users.map(user => user.email);
    } catch (error) {
      console.error('Erro ao buscar emails de usuários:', error);
      throw new Error('Falha ao buscar emails de usuários');
    }
  }
}

const emailService = new EmailService();

const sendEmail = async (options) => {
  const { email, subject, message, template, context } = options;

  const html = await emailService.loadTemplate(template || 'default', {
    ...context,
    message,
    subject,
    companyName: "Ice Cream Sorveteria",
    year: new Date().getFullYear()
  });

  return emailService.sendEmail(email, subject, html);
};


module.exports = new EmailService();
