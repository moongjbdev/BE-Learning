'use strict';

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {

    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add to cart successfully!',
            metadata: await CartService.addToCart(req.body)
        }).send(res);
    }

    //update + -
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update quantity cart successfully!',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res);
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete cart successfully!',
            metadata: await CartService.deleteUserCartItem(req.body)
        }).send(res);
    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list cart successfully!',
            metadata: await CartService.getListCart(req.query)
        }).send(res);
    }

}


module.exports = new CartController;