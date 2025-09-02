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

// Promises dos métodos do Redis
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const CACHE_KEYS = {
  ADMINS: 'stock:admins',
  LAST_NOTIFICATION: (productId) => `stock:last_notification:${productId}`,
  EMAIL_TEMPLATE: 'stock:email_template:low_stock'
};

const EXPIRATION = {
  ADMINS: 3600,
  LAST_NOTIFICATION: 86400,
  EMAIL_TEMPLATE: 86400
};

const StockCacheService = {
  async getAdmins() {
    try {
      const cachedAdmins = await getAsync(CACHE_KEYS.ADMINS);
      if (cachedAdmins) {
        return JSON.parse(cachedAdmins);
      }

      const admins = await User.find({
        role: { $in: ['admin', 'moder'] }
      }).select('email fullName');

      const formattedAdmins = admins.map(admin => ({
        email: admin.email,
        name: admin.fullName
      }));

      await setAsync(CACHE_KEYS.ADMINS, JSON.stringify(formattedAdmins));
      await expireAsync(CACHE_KEYS.ADMINS, EXPIRATION.ADMINS);

      return formattedAdmins;
    } catch (err) {
      console.error('Error in getAdmins:', err);
      const admins = await User.find({
        role: { $in: ['admin', 'moder'] }
      }).select('email fullName');

      return admins.map(admin => ({
        email: admin.email,
        name: admin.fullName
      }));
    }
  },

  async canSendNotification(productId) {
    try {
      const lastNotification = await getAsync(CACHE_KEYS.LAST_NOTIFICATION(productId));

      if (!lastNotification) {
        await setAsync(CACHE_KEYS.LAST_NOTIFICATION(productId), new Date().toISOString());
        await expireAsync(CACHE_KEYS.LAST_NOTIFICATION(productId), EXPIRATION.LAST_NOTIFICATION);
        return true;
      }

      const lastNotificationDate = new Date(lastNotification);
      const now = new Date();
      const hoursSinceLastNotification = (now - lastNotificationDate) / (1000 * 60 * 60);

      if (hoursSinceLastNotification >= 24) {
        await setAsync(CACHE_KEYS.LAST_NOTIFICATION(productId), now.toISOString());
        await expireAsync(CACHE_KEYS.LAST_NOTIFICATION(productId), EXPIRATION.LAST_NOTIFICATION);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error in canSendNotification:', err);
      return true;
    }
  },

  async getEmailTemplate(templateName, data) {
    const templateKey = `${CACHE_KEYS.EMAIL_TEMPLATE}:${templateName}`;

    try {
      let html = await getAsync(templateKey);

      if (!html) {
        const templatePath = path.join(__dirname, '../mail', templateName);
        html = await fs.readFile(templatePath, 'utf-8');

        await setAsync(templateKey, html);
        await expireAsync(templateKey, EXPIRATION.EMAIL_TEMPLATE);
      }

      Object.entries(data).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      return html;
    } catch (err) {
      console.error('Error in getEmailTemplate:', err);
      let html = await getAsync(templateKey);
      const templatePath = path.join(__dirname, '../mail', templateName);
      html = await fs.readFile(templatePath, 'utf-8');

      Object.entries(data).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      return html;
    }
  },

  async clearAdminsCache() {
    try {
      await delAsync(CACHE_KEYS.ADMINS);
    } catch (err) {
      console.error('Error clearing admins cache:', err);
    }
  },

  async clearProductNotificationCache(productId) {
    try {
      await delAsync(CACHE_KEYS.LAST_NOTIFICATION(productId));
    } catch (err) {
      console.error('Error clearing product notification cache:', err);
    }
  }
};

(async () => {
  try {
    await client.connect();
    console.log('Redis client connected for StockCacheService');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

module.exports = StockCacheService;
