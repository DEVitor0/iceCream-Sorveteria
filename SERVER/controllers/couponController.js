// controllers/couponController.js
const Coupon = require('../model/couponModel');
const mongoose = require('mongoose');
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
      applicableProducts = [],
      applicableCategories = [],
      isActive
    } = req.body;

    // Verificar se o código já existe
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      throw new ApiError(400, 'Já existe um cupom com este código');
    }

    // Converter strings para ObjectIds
    const validProductIds = applicableProducts
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    const validCategoryIds = applicableCategories
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      expirationDate: new Date(expirationDate),
      maxUses,
      userMaxUses,
      applicableProducts: validProductIds,
      applicableCategories: validCategoryIds,
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
// Atualizar cupom
exports.updateCoupon = async (req, res, next) => {
  try {
    console.log('Dados recebidos no backend:', req.body);

    const {
      code,
      discountType,
      discountValue,
      expirationDate,
      maxUses,
      userMaxUses,
      applicableProducts = [], // Valor padrão para evitar undefined
      applicableCategories = [],
      isActive
    } = req.body;

    // 1. Validar e filtrar produtos
    const validProductIds = applicableProducts
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    console.log('IDs de produtos válidos no backend:', validProductIds);

    // 2. Validar e filtrar categorias (mesma lógica)
    const validCategoryIds = applicableCategories
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    // 3. Atualizar o cupom
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          code,
          discountType,
          discountValue,
          expirationDate: new Date(expirationDate),
          maxUses,
          userMaxUses,
          isActive,
          applicableProducts: validProductIds,
          applicableCategories: validCategoryIds
        }
      },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      throw new ApiError(404, 'Cupom não encontrado');
    }

    console.log('Cupom atualizado:', coupon);

    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Erro no backend:', error);
    next(error);
  }
};

// Deletar cupom
exports.deleteCoupon = async (req, res, next) => {
  try {
      const coupon = await Coupon.findById(req.params.id);

      if (!coupon) {
          throw new ApiError(404, 'Cupom não encontrado');
      }

      // Verificar se o cupom já foi usado
      if (coupon.currentUses > 0) {
          throw new ApiError(400, 'Não é possível excluir um cupom que já foi utilizado');
      }

      // Verificar se o usuário tem permissão para excluir
      if (coupon.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
          throw new ApiError(403, 'Você não tem permissão para excluir este cupom');
      }

      await Coupon.findByIdAndDelete(req.params.id);

      res.status(200).json({
          success: true,
          data: {},
          message: 'Cupom excluído com sucesso'
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
