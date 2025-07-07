const mongoose = require('mongoose');
const stockEmitter = require('../utils/eventEmitter');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    brand: { type: String },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    tag: { type: String, required: true },
    imageUrl: { type: String },
    webImageUrl: { type: String },
    description: { type: String, maxlength: 500 },
    imageFile: { type: String }
});

productSchema.post('save', function(doc) {
  stockEmitter.emit('productSaved', doc);
});

module.exports = mongoose.model('Product', productSchema);
