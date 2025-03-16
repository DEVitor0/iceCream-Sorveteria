const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Renomeado de 'price' para 'productPrice'
    costPrice: { type: Number, required: true }, // Novo campo para preço de custo
    brand: { type: String }, // Novo campo para marca
    quantity: { type: Number, required: true }, // Novo campo para quantidade
    expirationDate: { type: Date, required: true }, // Novo campo para validade
    tag: { type: String, required: true },
    imageUrl: { type: String },
    webImageUrl: { type: String },
    description: { type: String, maxlength: 500 },
    imageFile: { type: String }
});

module.exports = mongoose.model('Product', productSchema);