const Coupon = require('../model/couponModel');
const Product = require('../model/productModel');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');


exports.validateAndApplyCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      throw new ApiError(400, 'Lista de itens do carrinho inválida');
    }

    const coupon = await Coupon.findOne({ code })
      .populate('applicableProducts', 'name price')
      .populate('applicableCategories', 'name');

    if (!coupon) {
      throw new ApiError(404, 'Código de cupom inválido ou não encontrado');
    }

    if (coupon.currentUses >= coupon.maxUses) {
      throw new ApiError(400, 'Este cupom já foi utilizado o máximo de vezes permitido');
    }

    if (new Date() > coupon.expirationDate) {
      throw new ApiError(400, `Este cupom expirou em ${coupon.expirationDate.toLocaleDateString()}`);
    }

    if (!coupon.isActive) {
      throw new ApiError(400, 'Este cupom está desativado');
    }

    if (req.user) {
      const userUsageCount = await coupon.getUserUsageCount(req.user.id);
      if (userUsageCount >= coupon.userMaxUses) {
        throw new ApiError(400, `Você já utilizou este cupom o máximo de ${coupon.userMaxUses} vezes permitidas`);
      }
    }

    const productIds = cartItems.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const applicableItems = cartItems.filter(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) return false;

      const isProductApplicable = coupon.applicableProducts.length === 0 ||
        coupon.applicableProducts.some(p => p._id.toString() === product._id.toString());

      const isCategoryApplicable = coupon.applicableCategories.length === 0 ||
        coupon.applicableCategories.some(cat => cat._id.toString() === product.tag);

      return isProductApplicable || isCategoryApplicable;
    });

    if (applicableItems.length === 0) {
      throw new ApiError(400, 'Este cupom não se aplica aos produtos no seu carrinho');
    }

    const subtotal = applicableItems.reduce((total, item) => {
      const product = products.find(p => p._id.toString() === item.productId);
      return total + (product.price * item.quantity);
    }, 0);

    let discountValue;
    if (coupon.discountType === 'percentage') {
      discountValue = subtotal * (coupon.discountValue / 100);
    } else {
      discountValue = Math.min(coupon.discountValue, subtotal);
    }

    res.status(200).json({
      success: true,
      data: {
        coupon: {
          id: coupon._id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          description: coupon.description || '',
          expirationDate: coupon.expirationDate,
          applicableProducts: coupon.applicableProducts,
          applicableCategories: coupon.applicableCategories
        },
        discountAmount: discountValue,
        applicableItems: applicableItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};

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

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      throw new ApiError(400, 'Já existe um cupom com este código');
    }

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

exports.getAllCoupons = async (req, res, next) => {
  try {
      const coupons = await Coupon.find({})
          .sort({ createdAt: -1 });

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
          status: coupon.status
      }));

      res.status(200).json({
          success: true,
          data: formattedCoupons
      });
  } catch (error) {
      next(error);
  }
};

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
      applicableProducts = [],
      applicableCategories = [],
      isActive
    } = req.body;

    const validProductIds = applicableProducts
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    console.log('IDs de produtos válidos no backend:', validProductIds);

    const validCategoryIds = applicableCategories
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

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

exports.deleteCoupon = async (req, res, next) => {
  try {
      const coupon = await Coupon.findById(req.params.id);

      if (!coupon) {
          throw new ApiError(404, 'Cupom não encontrado');
      }

      if (coupon.currentUses > 0) {
          throw new ApiError(400, 'Não é possível excluir um cupom que já foi utilizado');
      }

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
