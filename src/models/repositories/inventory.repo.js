const { inventory } = require("../inventory.model");

const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }) => {
    return await inventory.create({ productId, shopId, stock, location });
}