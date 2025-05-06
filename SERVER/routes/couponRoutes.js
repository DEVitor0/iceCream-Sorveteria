// routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { body } = require('express-validator');
const validateCouponInput = require('../middlewares/validateCouponInput');

// Middlewares
const authenticateJWT = require('../middlewares/authMiddleware');
const checkAdminOrModer = require('../middlewares/isAdministratorMiddleware');
const geoRestrictionMiddleware = require('../middlewares/geoRestrictionMiddleware');

// Validações
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

// Rotas
router.route('/')
    .get(
        authenticateJWT,
        checkAdminOrModer,
        geoRestrictionMiddleware,
        couponController.getAllCoupons
    )
    .post(
        authenticateJWT,
        checkAdminOrModer,
        geoRestrictionMiddleware,
        couponValidations,
        validateCouponInput,
        couponController.createCoupon
    );

router.route('/:id')
    .get(
        authenticateJWT,
        checkAdminOrModer,
        geoRestrictionMiddleware,
        couponController.getCoupon
    )
    .put(
        authenticateJWT,
        checkAdminOrModer,
        geoRestrictionMiddleware,
        couponValidations,
        validateCouponInput,
        couponController.updateCoupon
    )
    .delete(
        authenticateJWT,
        checkAdminOrModer,
        geoRestrictionMiddleware,
        couponController.deleteCoupon
    );

router.get('/validate/:code',
    authenticateJWT,
    couponController.validateCoupon
);

module.exports = router;
