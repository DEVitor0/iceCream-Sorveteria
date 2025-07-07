const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponUsageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  usedAt: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: Schema.Types.ObjectId
  }
});

const couponSchema = new Schema({
    code: {
        type: String,
        required: [true, 'O código do cupom é obrigatório'],
        unique: true,
        trim: true,
        uppercase: true
    },
    discountType: {
        type: String,
        required: [true, 'O tipo de desconto é obrigatório'],
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: [true, 'O valor do desconto é obrigatório'],
        min: [0, 'O valor do desconto não pode ser negativo']
    },
    expirationDate: {
        type: Date,
        required: [true, 'A data de validade é obrigatória']
    },
    maxUses: {
        type: Number,
        required: [true, 'A quantidade máxima de usos é obrigatória'],
        min: [1, 'A quantidade máxima de usos deve ser pelo menos 1']
    },
    currentUses: {
        type: Number,
        default: 0
    },
    userMaxUses: {
        type: Number,
        required: [true, 'O limite de uso por cliente é obrigatório'],
        min: [1, 'O limite de uso por cliente deve ser pelo menos 1']
    },
    applicableProducts: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        validate: {
          validator: function(v) {
            return mongoose.Types.ObjectId.isValid(v);
          },
          message: props => `${props.value} não é um ID de produto válido!`
        }
      }],
      default: []
    },
    applicableCategories: {
      type: [{
        type: Schema.Types.ObjectId,
        validate: {
          validator: function(v) {
            return mongoose.Types.ObjectId.isValid(v);
          },
          message: props => `${props.value} não é um ID de categoria válido!`
        }
      }],
      default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    usages: [couponUsageSchema]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

couponSchema.index({ code: 1 });
couponSchema.index({ expirationDate: 1 });
couponSchema.index({ isActive: 1 });

couponSchema.virtual('status').get(function() {
    if (this.currentUses >= this.maxUses) return 'used';
    if (new Date() > this.expirationDate) return 'expired';
    return this.isActive ? 'active' : 'inactive';
});

couponSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

couponSchema.statics.validateCoupon = async function(code, userId) {
    const coupon = await this.findOne({ code })
        .populate('applicableProducts', 'name price')
        .populate('applicableCategories', 'name');

    if (!coupon) {
        throw new Error('Cupom não encontrado');
    }

    if (coupon.status !== 'active') {
        throw new Error(`Cupom ${coupon.status === 'used' ? 'já foi totalmente utilizado' : coupon.status === 'expired' ? 'está expirado' : 'está inativo'}`);
    }

    return coupon;
};

couponSchema.methods.getUserUsageCount = async function(userId) {
  return this.usages.filter(usage =>
    usage.userId.toString() === userId.toString()
  ).length;
};

couponSchema.methods.recordUsage = async function(userId) {
  this.usages.push({ userId });
  this.currentUses += 1;
  await this.save();
};

couponSchema.methods.isProductApplicable = function(productId, productCategory) {
  if (this.applicableProducts.length === 0 && this.applicableCategories.length === 0) {
    return true;
  }

  const productMatch = this.applicableProducts.some(id =>
    id.toString() === productId.toString()
  );

  const categoryMatch = this.applicableCategories.some(catId =>
    catId.toString() === productCategory.toString()
  );

  return productMatch || categoryMatch;
};

couponSchema.methods.recordUsage = async function(userId) {
  this.currentUses += 1;
  await this.save();
};

module.exports = mongoose.model('Coupon', couponSchema);
