const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
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

module.exports = router;
