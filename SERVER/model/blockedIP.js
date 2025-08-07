const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  blockedAt: { type: Date, default: Date.now },
  reason: { type: String, default: 'Acesso de fora do Brasil' }
});

module.exports = mongoose.models.BlockedIP || mongoose.model('BlockedIP', schema);
