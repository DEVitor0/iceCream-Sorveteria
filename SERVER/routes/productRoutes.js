const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware');
const { createProduct } = require('../controllers/productController');

router.post('/cadastrar', authenticateJWT, createProduct);

module.exports = router;
