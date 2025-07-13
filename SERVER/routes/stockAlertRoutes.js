const express = require('express');
const router = express.Router();
const Product = require('../model/productModel');
const { lowStockThreshold } = require('../configs/others/mailers/stockAlert');

router.get('/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      quantity: { $lte: lowStockThreshold }
    }).select('name quantity imageUrl').limit(6);

    res.json({
      products: lowStockProducts.slice(0, 5),
      hasMore: lowStockProducts.length > 5
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos com estoque baixo' });
  }
});

module.exports = router;
