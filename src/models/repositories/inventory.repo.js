const { convertToOnjectIdMongodb } = require("../../utils");
const { inventory } = require("../inventory.model");
const { Types } = require("mongoose")


// =================================================================
const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location
    });
}

const reservationInventory = async ({ productId, quantity, cardId }) => {
    const query = {
        inven_productId: convertToOnjectIdMongodb(productId),
        inven_stock: { $gte: quantity }
    },
        updateSet = {
            $inc: { inven_stock: -quantity },
            $push: { inven_reservations: { cardId, quantity, createOn: new Date() } }
        },
        options = { upsert: true, new: true };

    return await inventory.updateOne(query, updateSet)
}


module.exports = {
    insertInventory,
    reservationInventory
}