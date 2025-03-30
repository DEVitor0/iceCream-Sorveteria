const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middlewares/productValidationMiddleware');
const authenticateJWT = require('../middlewares/authMiddleware');
const upload = require('../configs/multerConfig');
const csrfProtection = require('../configs/csrfProtectionConfigs');

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

// Nova rota para exclusão de produtos
router.delete(
  '/editar-produtos/:id',
  csrfProtection,
  authenticateJWT,
  productController.deleteProduct
);

module.exports = router;