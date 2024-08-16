'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');

const { cart } = require("../models/cart.model");

/**
    Key feature: Cart service
    -Add product to cart [user]
    -increase quantity by One [user]
    -get cart [user]
    -delete cart [user]
    delete cart item [user]
 */

class CartService {

    //START REPO CART //
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product,
                }
            },
            options = { upsert: true, new: true };

        return await cart.findOneAndUpdate(query, updateOrInsert, options);

    }


    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': product,
            cart_state: 'active'
        },
            updateSet = {
                $inc: {
                    'cart_products.$.quantity': quantity
                }
            },
            options = { upsert: true, new: true };

        return await cart.findOneAndUpdate(query, updateSet, options);
    }



    // END REPO CART //

    static async addToCart({ userId, product = {} }) {

        const userCart = await cart.findOne({ cart_userId: userId });

        //check xem ton tai hay khong
        if (!userCart) {
            //create new cart
            return await this.createUserCart({ userId, product })
        }

        //neu co gio hang nhung chua co san pham
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        //neu gio hang ton tai va co san pham nay thi update quantity
        return await this.updateUserCartQuantity({ userId, product })

    }


}

module.exports = CartService;