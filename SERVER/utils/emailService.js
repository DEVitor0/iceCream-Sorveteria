const nodemailer = require('nodemailer');
const emailConfig = require('../configs/emailConfig');
const User = require('../model/userModel');
const path = require('path');
const fs = require('fs').promises;

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
      // Corrigido o caminho para ../mail/
      const templatePath = path.join(__dirname, '../mail', `${templateName}.html`);
      console.log(`Tentando carregar template de: ${templatePath}`); // Log para debug

      let html = await fs.readFile(templatePath, 'utf8');

      // Substituir placeholders
      Object.keys(replacements).forEach(key => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
      });

      return html;
    } catch (error) {
      console.error(`Erro ao carregar template ${templateName}:`, error);
      throw new Error(`Falha ao carregar template de email: ${templateName}. Verifique se o arquivo existe.`);
    }
  }

  async sendEmail(to, subject, html) {
    try {
      await this.transporter.sendMail({
        from: emailConfig.defaultFrom,
        to,
        subject,
        html
      });
      return true;
    } catch (error) {
      console.error(`Erro ao enviar email para ${to}:`, error);
      return false;
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

module.exports = new EmailService();
