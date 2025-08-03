const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST || 'redis',
                port: process.env.REDIS_PORT || 6379
            }
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.connect();
    }

    async connect() {
        await this.client.connect();
        console.log('Redis connected successfully!');
    }

    async set(key, value, ttl = null) {
        try {
            if (ttl) {
                await this.client.setEx(key, ttl, JSON.stringify(value));
            } else {
                await this.client.set(key, JSON.stringify(value));
            }
        } catch (err) {
            console.error('Redis set error:', err);
        }
    }

    async get(key) {
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error('Redis get error:', err);
            return null;
        }
    }

    async del(key) {
        try {
            await this.client.del(key);
        } catch (err) {
            console.error('Redis del error:', err);
        }
    }

    async quit() {
        await this.client.quit();
    }
}

module.exports = new RedisClient();
