const EventEmitter = require('events');
class StockEmitter extends EventEmitter {}
const stockEmitter = new StockEmitter();
module.exports = stockEmitter;
