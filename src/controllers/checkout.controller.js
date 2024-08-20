'use strict';

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {

    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'checkout successfully!',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res);
    }
}


module.exports = new CheckoutController;