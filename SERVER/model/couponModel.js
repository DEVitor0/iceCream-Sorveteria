const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    applicableProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    applicableCategories: [{
        type: Schema.Types.ObjectId,
    }],
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
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
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

module.exports = mongoose.model('Coupon', couponSchema);
