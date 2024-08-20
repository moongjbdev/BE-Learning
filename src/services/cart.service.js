'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');

const { cart } = require("../models/cart.model");
const { getProductById } = require('../models/repositories/product.repo');

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
            'cart_products.productId': productId,
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

    // update cart
    /**
     * Payload from FE 
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        shopId,
                        quantity,
                        price,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
     */

    static async addToCartV2({ userId, shop_order_ids = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        //check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError(`Product not found`);
        //compare 
        if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
            throw new NotFoundError(`Product not found`);
        }
        //remove if quantity = 0
        if (quantity === 0) {

        }

        return await this.updateUserCartQuantity({
            userId,
            product: { productId, quantity: quantity - old_quantity }
        })

    }

    static async deleteUserCartItem({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: 'active',
        },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }

        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart


    }

    static async getListCart({ userId }) {
        return await cart.findOne({ cart_userId: +userId }).lean()
    }

}

module.exports = CartService;