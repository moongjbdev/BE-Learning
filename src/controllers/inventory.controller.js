'use strict';

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {

    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'checkout successfully!',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res);
    }
}


module.exports = new InventoryController;