const emailService = require('../../../utils/others/mailers/emailService');
const ApiError = require('../../../utils/ApiError');

class EmailController {
  async sendMassEmail(req, res, next) {
    try {
      const { emailType, subject, content } = req.body;

      if (!['retention', 'promotional', 'operational', 'warning'].includes(emailType)) {
        throw new ApiError(400, 'Invalid email type');
      }

      const emails = await emailService.getAllUserEmails();

      const replacements = {
        subject,
        content,
        companyName: "Ice Cream Sorveteria",
        year: new Date().getFullYear(),
        unsubscribeLink: "#"
      };

      await emailService.sendBulkEmails(
        emails,
        subject,
        emailType,
        replacements
      );

      res.json({
        success: true,
        message: 'Emails are being sent in the background'
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new EmailController();
