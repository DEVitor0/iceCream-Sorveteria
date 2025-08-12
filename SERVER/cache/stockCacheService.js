const redis = require('redis');
const { promisify } = require('util');
const User = require('../model/userModel');
const config = require('../configs/others/mailers/stockAlert');
const fs = require('fs');
const path = require('path');

// Configuração do cliente Redis
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Tentar reconectar por até 1 minuto
      return Math.min(retries * 100, 60000);
    }
  }
});

// Promisify dos métodos do Redis
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);

// Tratamento de erros
client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Chaves de cache
const CACHE_KEYS = {
  ADMINS: 'stock:admins',
  LAST_NOTIFICATION: (productId) => `stock:last_notification:${productId}`,
  EMAIL_TEMPLATE: 'stock:email_template:low_stock'
};

// Tempos de expiração (em segundos)
const EXPIRATION = {
  ADMINS: 3600, // 1 hora
  LAST_NOTIFICATION: 86400, // 24 horas
  EMAIL_TEMPLATE: 86400 // 24 horas
};

const StockCacheService = {
  /**
   * Obtém a lista de administradores do cache ou do banco de dados
   */
  async getAdmins() {
    try {
      // Tentar obter do cache
      const cachedAdmins = await getAsync(CACHE_KEYS.ADMINS);
      if (cachedAdmins) {
        return JSON.parse(cachedAdmins);
      }

      // Se não estiver em cache, buscar do banco
      const admins = await User.find({
        role: { $in: ['admin', 'moder'] }
      }).select('email fullName');

      const formattedAdmins = admins.map(admin => ({
        email: admin.email,
        name: admin.fullName
      }));

      // Armazenar no cache
      await setAsync(CACHE_KEYS.ADMINS, JSON.stringify(formattedAdmins));
      await expireAsync(CACHE_KEYS.ADMINS, EXPIRATION.ADMINS);

      return formattedAdmins;
    } catch (err) {
      console.error('Error in getAdmins:', err);
      // Fallback para o banco de dados em caso de erro no Redis
      const admins = await User.find({
        role: { $in: ['admin', 'moder'] }
      }).select('email fullName');

      return admins.map(admin => ({
        email: admin.email,
        name: admin.fullName
      }));
    }
  },

  /**
   * Verifica se pode enviar notificação para um produto
   * (implementa rate limiting)
   */
  async canSendNotification(productId) {
    try {
      const lastNotification = await getAsync(CACHE_KEYS.LAST_NOTIFICATION(productId));

      if (!lastNotification) {
        // Se não há registro, pode enviar
        await setAsync(CACHE_KEYS.LAST_NOTIFICATION(productId), new Date().toISOString());
        await expireAsync(CACHE_KEYS.LAST_NOTIFICATION(productId), EXPIRATION.LAST_NOTIFICATION);
        return true;
      }

      // Verificar se já passou tempo suficiente desde a última notificação
      const lastNotificationDate = new Date(lastNotification);
      const now = new Date();
      const hoursSinceLastNotification = (now - lastNotificationDate) / (1000 * 60 * 60);

      // Se já passou mais de 24 horas, pode enviar novamente
      if (hoursSinceLastNotification >= 24) {
        await setAsync(CACHE_KEYS.LAST_NOTIFICATION(productId), now.toISOString());
        await expireAsync(CACHE_KEYS.LAST_NOTIFICATION(productId), EXPIRATION.LAST_NOTIFICATION);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error in canSendNotification:', err);
      // Em caso de erro no Redis, permitir o envio (fail open)
      return true;
    }
  },

  /**
   * Obtém o template de e-mail do cache ou do sistema de arquivos
   */
  async getEmailTemplate(templateName, data) {
    const templateKey = `${CACHE_KEYS.EMAIL_TEMPLATE}:${templateName}`;

    try {
      // Tentar obter do cache
      let html = await getAsync(templateKey);

      if (!html) {
        // Se não estiver em cache, carregar do sistema de arquivos
        const templatePath = path.join(__dirname, '../mail', templateName);
        html = await fs.readFile(templatePath, 'utf-8');

        // Armazenar no cache
        await setAsync(templateKey, html);
        await expireAsync(templateKey, EXPIRATION.EMAIL_TEMPLATE);
      }

      // Substituir placeholders
      Object.entries(data).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      return html;
    } catch (err) {
      console.error('Error in getEmailTemplate:', err);
      let html = await getAsync(templateKey);
      // Fallback para o sistema de arquivos
      const templatePath = path.join(__dirname, '../mail', templateName);
      html = await fs.readFile(templatePath, 'utf-8');

      Object.entries(data).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      return html;
    }
  },

  /**
   * Limpa o cache de administradores
   */
  async clearAdminsCache() {
    try {
      await delAsync(CACHE_KEYS.ADMINS);
    } catch (err) {
      console.error('Error clearing admins cache:', err);
    }
  },

  /**
   * Limpa o cache de notificações para um produto específico
   */
  async clearProductNotificationCache(productId) {
    try {
      await delAsync(CACHE_KEYS.LAST_NOTIFICATION(productId));
    } catch (err) {
      console.error('Error clearing product notification cache:', err);
    }
  }
};

// Inicialização do cliente Redis
(async () => {
  try {
    await client.connect();
    console.log('Redis client connected for StockCacheService');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

module.exports = StockCacheService;
