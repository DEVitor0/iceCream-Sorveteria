const Coupon = require('../model/couponModel');


exports.createOrder = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user.id;

    // ... processar pedido ...

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon) {
        await coupon.recordUsage(userId);
      }
    }

    // ... finalizar pedido ...
  } catch (error) {
    next(error);
  }
};
