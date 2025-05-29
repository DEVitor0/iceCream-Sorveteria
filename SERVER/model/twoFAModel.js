const mongoose = require('mongoose');

const TwoFACodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});

const TwoFACodeModel = mongoose.model('TwoFACode', TwoFACodeSchema);
module.exports = TwoFACodeModel;
