const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: String
});

const paymentDetailsSchema = new Schema({
  paymentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'refunded', 'cancelled', 'in_process', 'charged_back']
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    required: true
  },
  installments: {
    type: Number,
    default: 1
  },
  totalPaid: {
    type: Number,
    required: true
  },
  transactionDetails: {
    type: Schema.Types.Mixed
  },
  mercadoPagoResponse: {
    type: Schema.Types.Mixed
  }
});

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  couponCode: String,
  shippingAddress: {
    type: Schema.Types.Mixed
  },
  payment: paymentDetailsSchema,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed'],
    default: 'pending'
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para melhor performance nas consultas
orderSchema.index({ userId: 1 });
orderSchema.index({ 'payment.paymentId': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Middleware para atualizar o updatedAt
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Método para atualizar estoque
orderSchema.methods.updateInventory = async function() {
  const Order = this.constructor;

  try {
    for (const item of this.items) {
      await mongoose.model('Product').updateOne(
        { _id: item.productId },
        { $inc: { quantity: -item.quantity } }
      );
    }

    await Order.updateOne(
      { _id: this._id },
      { $set: { status: 'completed' } }
    );

    return true;
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    return false;
  }
};

module.exports = mongoose.model('Order', orderSchema);
