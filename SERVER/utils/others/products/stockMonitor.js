const Product = require('../../../model/productModel');
const { checkLowStock } = require('../../../controllers/validation/stockAlertController');

const initialStockCheck = async () => {
    try {
        const lowStockProducts = await Product.find({
            quantity: { $lte: 10 }
        });

        await Promise.all(lowStockProducts.map(checkLowStock));
    } catch (error) {
        console.error('Initial stock check failed:', error);
    }
};

module.exports = { initialStockCheck };
