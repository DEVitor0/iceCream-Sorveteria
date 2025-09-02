const express = require('express');
const router = express.Router();
const couponController = require('../controllers/validation/couponController');
const { body } = require('express-validator');
const validateCouponInput = require('../middlewares/validation/validateCouponInput');
const csrfProtection = require('../configs/security/csrfProtectionConfigs');

const geoRestrictionMiddleware = require('../middlewares/security/geoRestrictionMiddleware');

const couponValidations = [
    body('code').trim().notEmpty().withMessage('Código é obrigatório'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Tipo de desconto inválido'),
    body('discountValue').isFloat({ min: 0 }).withMessage('Valor de desconto inválido'),
    body('expirationDate').isISO8601().withMessage('Data de validade inválida'),
    body('maxUses').isInt({ min: 1 }).withMessage('Máximo de usos deve ser pelo menos 1'),
    body('userMaxUses').isInt({ min: 1 }).withMessage('Limite por usuário deve ser pelo menos 1'),
    body('applicableProducts').optional().isArray(),
    body('applicableCategories').optional().isArray(),
    body('isActive').optional().isBoolean()
];

router.route('/')
    .get(
        geoRestrictionMiddleware,
        couponController.getAllCoupons
    )
    .post(
        geoRestrictionMiddleware,
        couponValidations,
        validateCouponInput,
        couponController.createCoupon
    );

router.route('/:id')
    .get(
        geoRestrictionMiddleware,
        couponController.getCoupon
    )
    .put(
        geoRestrictionMiddleware,
        csrfProtection,
        couponValidations,
        validateCouponInput,
        couponController.updateCoupon
    )
    .delete(
        geoRestrictionMiddleware,
        couponController.deleteCoupon
    );

router.get('/validate/:code',
    couponController.validateCoupon
);

router.post('/validate-with-cart/:code',
  csrfProtection,
  [
    body('cartItems').isArray().withMessage('Itens do carrinho devem ser um array'),
    body('cartItems.*.productId').isMongoId().withMessage('ID do produto inválido'),
    body('cartItems.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser pelo menos 1')
  ],
  validateCouponInput,
  couponController.validateAndApplyCoupon
);

module.exports = router;
