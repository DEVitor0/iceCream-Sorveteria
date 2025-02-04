const { createCanvas } = require('canvas');
const config = require('../configs/captcha');

const generateRandomText = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
};

const generateCaptcha = () => {
    const canvas = createCanvas(config.width, config.height);
    const ctx = canvas.getContext('2d');

    // Gerar texto
    const text = generateRandomText(config.textLength);

    // Preencher fundo
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, config.width, config.height);

    // Adicionar texto
    ctx.fillStyle = '#000';
    ctx.font = '35px Arial';
    ctx.fillText(text, 50, 35);

    // Adicionar ruído
    for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.7)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * config.width, Math.random() * config.height);
        ctx.lineTo(Math.random() * config.width, Math.random() * config.height);
        ctx.stroke();
    }

    return { text, dataUrl: canvas.toDataURL() };
};

module.exports = generateCaptcha;
