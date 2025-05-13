// controllers/couponController.js
const Coupon = require('../model/couponModel');
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Validações podem ser movidas para um arquivo separado se necessário
const validateCouponInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Criar novo cupom
exports.createCoupon = async (req, res, next) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            expirationDate,
            maxUses,
            userMaxUses,
            applicableProducts,
            applicableCategories,
            isActive
        } = req.body;

        // Verificar se o código já existe
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            throw new ApiError(400, 'Já existe um cupom com este código');
        }

        // Validar valores
        if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
            throw new ApiError(400, 'O desconto percentual deve estar entre 0 e 100');
        }

        if (discountType === 'fixed' && discountValue <= 0) {
            throw new ApiError(400, 'O desconto fixo deve ser maior que zero');
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            expirationDate: new Date(expirationDate),
            maxUses,
            userMaxUses,
            applicableProducts,
            applicableCategories,
            isActive,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

// Listar todos os cupons
exports.getAllCoupons = async (req, res, next) => {
  try {
      const coupons = await Coupon.find({})
          .sort({ createdAt: -1 });

      // Formatar os dados conforme necessário para o frontend
      const formattedCoupons = coupons.map(coupon => ({
          id: coupon._id,
          code: coupon.code,
          discount: coupon.discountType === 'fixed'
              ? `R$${coupon.discountValue.toFixed(2)}`
              : `${coupon.discountValue}%`,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          currentUses: coupon.currentUses,
          expirationDate: coupon.expirationDate,
          maxUses: coupon.maxUses,
          isActive: coupon.isActive,
          status: coupon.status // usando o virtual field do schema
      }));

      res.status(200).json({
          success: true,
          data: formattedCoupons
      });
  } catch (error) {
      next(error);
  }
};

// Obter detalhes de um cupom
exports.getCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id)
            .populate('applicableProducts', 'name price')
            .populate('applicableCategories', 'name')
            .populate('createdBy', 'name email');

        if (!coupon) {
            throw new ApiError(404, 'Cupom não encontrado');
        }

        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

// Atualizar cupom
exports.updateCoupon = async (req, res, next) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            expirationDate,
            maxUses,
            userMaxUses,
            applicableProducts,
            applicableCategories,
            isActive
        } = req.body;

        // Verificar se o cupom existe
        let coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            throw new ApiError(404, 'Cupom não encontrado');
        }

        // Verificar se o novo código já existe (se foi alterado)
        if (code && code !== coupon.code) {
            const existingCoupon = await Coupon.findOne({ code });
            if (existingCoupon) {
                throw new ApiError(400, 'Já existe um cupom com este código');
            }
        }

        // Atualizar campos
        coupon.code = code || coupon.code;
        coupon.discountType = discountType || coupon.discountType;
        coupon.discountValue = discountValue || coupon.discountValue;
        coupon.expirationDate = expirationDate ? new Date(expirationDate) : coupon.expirationDate;
        coupon.maxUses = maxUses || coupon.maxUses;
        coupon.userMaxUses = userMaxUses || coupon.userMaxUses;
        coupon.applicableProducts = applicableProducts || coupon.applicableProducts;
        coupon.applicableCategories = applicableCategories || coupon.applicableCategories;
        coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

        await coupon.save();

        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

// Deletar cupom
exports.deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            throw new ApiError(404, 'Cupom não encontrado');
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// Validar cupom (para uso no checkout)
exports.validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.params;
        const userId = req.user.id;

        const coupon = await Coupon.validateCoupon(code, userId);

        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};
