const User = require('../model/userModel');
const { sendLowStockEmail } = require('../utils/lowStockMailer');
const stockEmitter = require('../utils/eventEmitter');
const config = require('../configs/stockAlert');

const checkLowStock = async (product) => {
    if (product.quantity <= config.lowStockThreshold) {
        const admins = await User.find({
            role: { $in: ['admin', 'moder'] }
        }).select('email fullName');

        await sendLowStockEmail({
            productName: product.name,
            remainingQuantity: product.quantity,
            admins: admins.map(admin => ({
                email: admin.email,
                name: admin.fullName
            }))
        });

        config.lastNotification[product._id] = new Date();
    }
};

stockEmitter.on('productSaved', (product) => {
    checkLowStock(product).catch(console.error);
});

module.exports = { checkLowStock };
