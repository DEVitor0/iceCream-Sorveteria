const express = require('express');
const router = express.Router();
const Product = require('../model/productModel');

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
});

// Rota para buscar nomes dos produtos
router.get('/product-names', async (req, res) => {
  try {
    const products = await Product.find({}, 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar nomes dos produtos', error });
  }
});

router.get('/product-price', async (req, res) => {
  try {
    const products = await Product.find({}, 'price');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar preços dos produtos', error });
  }
});

module.exports = router;