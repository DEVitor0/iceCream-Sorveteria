const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const Product = require('../model/productModel');
const { validateProduct } = require('../middlewares/productValidationMiddleware');
const authenticateJWT = require('../middlewares/authMiddleware');
const upload = require('../configs/multerConfig');
const csrfProtection = require('../configs/csrfProtectionConfigs');

// Rotas protegidas por autenticação
router.get(
  '/editar-produtos',
  csrfProtection,
  authenticateJWT,
  productController.getAllProducts
);

router.get(
  '/produtos/:id',
  csrfProtection,
  authenticateJWT,
  productController.getProductById
);

router.post(
  '/cadastrar',
  csrfProtection,
  authenticateJWT,
  upload.single('imageFile'),
  validateProduct,
  productController.createProduct
);

router.put(
  '/editar-produtos/:id',
  csrfProtection,
  authenticateJWT,
  upload.single('imageFile'),
  validateProduct,
  productController.updateProduct
);

router.delete(
  '/editar-produtos/:id',
  csrfProtection,
  authenticateJWT,
  productController.deleteProduct
);

// Rotas para o frontend (sem autenticação para simplificar)
router.get('/products-for-coupons', productController.getAllProductsForCoupons);
router.get('/unique-categories-from-tags', productController.getUniqueCategoriesFromTags);

// Adicione estas novas rotas para compatibilidade
router.get('/products', productController.getAllProductsForCoupons);
router.get('/categories', productController.getUniqueCategoriesFromTags);

// Nova rota para verificar estoque e preços
router.post(
  '/verify-checkout',
  csrfProtection,
  authenticateJWT,
  async (req, res) => {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Lista de itens inválida' });
      }

      // Buscar todos os produtos de uma vez
      const productIds = items.map(item => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });

      // Verificar se todos os produtos existem
      if (products.length !== items.length) {
        const missingProducts = items.filter(item =>
          !products.some(p => p._id.toString() === item.productId)
        );
        return res.status(404).json({
          message: 'Alguns produtos não foram encontrados',
          missingProducts
        });
      }

      // Verificar estoque e preços
      const outOfStock = [];
      const priceChanged = [];
      let total = 0;

      items.forEach(item => {
        const product = products.find(p => p._id.toString() === item.productId);

        // Verificar estoque
        if (product.quantity < item.quantity) {
          outOfStock.push({
            productId: product._id,
            name: product.name,
            available: product.quantity,
            requested: item.quantity
          });
        }

        // Verificar se o preço mudou (com margem de 0.01 para evitar problemas de arredondamento)
        if (Math.abs(product.price - item.price) > 0.01) {
          priceChanged.push({
            productId: product._id,
            name: product.name,
            oldPrice: item.price,
            newPrice: product.price
          });
        }

        total += product.price * item.quantity;
      });

      if (outOfStock.length > 0 || priceChanged.length > 0) {
        return res.status(409).json({
          message: 'Alguns produtos precisam de atenção',
          outOfStock,
          priceChanged,
          total
        });
      }

      // Tudo ok
      res.status(200).json({
        message: 'Produtos verificados com sucesso',
        total
      });

    } catch (error) {
      console.error('Erro na verificação:', error);
      res.status(500).json({ message: 'Erro ao verificar produtos', error: error.message });
    }
  }
);

module.exports = router;
