const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  tag: { type: String, required: true },
  imageUrl: { type: String, required: false },
  imageFile: { type: String, required: false },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; // Exportação no CommonJS
