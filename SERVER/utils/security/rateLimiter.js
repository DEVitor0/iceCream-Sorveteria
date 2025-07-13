class RateLimiter {
  constructor(maxRequests, interval) {
    this.maxRequests = maxRequests;
    this.interval = interval;
    this.queue = [];
    this.processing = 0;
    this.lastProcessed = Date.now();
  }

  async add(task) {
    return new Promise((resolve) => {
      this.queue.push({ task, resolve });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing >= this.maxRequests || this.queue.length === 0) {
      return;
    }

    const now = Date.now();
    const timeSinceLast = now - this.lastProcessed;

    if (timeSinceLast < this.interval && this.processing > 0) {
      setTimeout(() => this.processQueue(), this.interval - timeSinceLast);
      return;
    }

    this.processing++;
    const { task, resolve } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      console.error('Error in rate limited task:', error);
      resolve(null);
    } finally {
      this.processing--;
      this.lastProcessed = Date.now();
      this.processQueue();
    }
  }
}

module.exports = RateLimiter;
