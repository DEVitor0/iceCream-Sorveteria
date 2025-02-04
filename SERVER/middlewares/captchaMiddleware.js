const config = require('../configs/captcha');

module.exports = (req, res, next) => {
    const captcha = req.session[config.sessionKey];
    const userInput = req.body.captchaText;

    // Verifica se o CAPTCHA existe e não expirou
    if (!captcha || Date.now() > captcha.expires) {
        return res.status(400).json({ error: 'CAPTCHA expirado. Recarregue a página.' });
    }

    // Verifica se o texto do CAPTCHA está correto
    if (userInput.toLowerCase() !== captcha.text.toLowerCase()) {
        return res.status(400).json({ error: 'CAPTCHA incorreto. Tente novamente.' });
    }

    // Remove o CAPTCHA da sessão após a validação
    delete req.session[config.sessionKey];
    next(); // Passa para a próxima função (controller de login/registro)
};
