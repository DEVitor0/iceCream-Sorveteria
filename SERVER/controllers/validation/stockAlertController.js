const User = require('../../model/userModel');
const { sendLowStockEmail } = require('../../utils/others/products/lowStockMailer');
const stockEmitter = require('../../utils/others/products/eventEmitter');
const config = require('../../configs/others/mailers/stockAlert');
const StockCacheService = require('../../cache/productCache');

const checkLowStock = async (product) => {
    if (product.quantity <= config.lowStockThreshold) {
        // Verificar se podemos enviar a notificação
        const canSend = await StockCacheService.canSendNotification(product._id);
        if (!canSend) return;

        // Obter administradores do cache
        const admins = await StockCacheService.getAdmins();

        await sendLowStockEmail({
            productName: product.name,
            remainingQuantity: product.quantity,
            admins
        });

        // Atualizar o cache de notificação
        await StockCacheService.clearProductNotificationCache(product._id);
        await StockCacheService.canSendNotification(product._id);
    }
};

stockEmitter.on('productSaved', (product) => {
    checkLowStock(product).catch(console.error);
});

// Eventos para limpar cache quando necessário
stockEmitter.on('adminUpdated', () => {
    StockCacheService.clearAdminsCache().catch(console.error);
});

module.exports = { checkLowStock };
