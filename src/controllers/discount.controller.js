'use strict';

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create discount code successfully!',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            })
        }).send(res);
    }

    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list discount codes successfully!',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId,
            })
        }).send(res);
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get discount amount successfully!',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res);
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list discount codes with products successfully!',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
            })
        }).send(res);
    }

    getAllDiscountCodesByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list discount codes with products successfully!',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
            })
        }).send(res);
    }
}


module.exports = new DiscountController;