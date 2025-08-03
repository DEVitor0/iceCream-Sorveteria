const redisClient = require('../configs/others/redis/redisConfigs');

const productCache = {
    getAllProducts: async (req, res, next) => {
        const cacheKey = 'products:all';

        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            const originalJson = res.json;
            res.json = (body) => {
                redisClient.set(cacheKey, body, 3600); // 1 hora
                originalJson.call(res, body);
            };

            next();
        } catch (err) {
            console.error('Product cache error:', err);
            next();
        }
    },

    getProductById: async (req, res, next) => {
        const { id } = req.params;
        const cacheKey = `products:${id}`;

        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            const originalJson = res.json;
            res.json = (body) => {
                redisClient.set(cacheKey, body, 1800); // 30 minutos
                originalJson.call(res, body);
            };

            next();
        } catch (err) {
            console.error('Product by ID cache error:', err);
            next();
        }
    },

    getAllProductsForCoupons: async (req, res, next) => {
        const cacheKey = 'products:for-coupons';

        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            const originalJson = res.json;
            res.json = (body) => {
                redisClient.set(cacheKey, body, 7200); // 2 horas
                originalJson.call(res, body);
            };

            next();
        } catch (err) {
            console.error('Products for coupons cache error:', err);
            next();
        }
    },

    getUniqueCategoriesFromTags: async (req, res, next) => {
        const cacheKey = 'products:unique-categories';

        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            const originalJson = res.json;
            res.json = (body) => {
                redisClient.set(cacheKey, body, 86400);
                originalJson.call(res, body);
            };

            next();
        } catch (err) {
            console.error('Unique categories cache error:', err);
            next();
        }
    }
};

module.exports = productCache;
