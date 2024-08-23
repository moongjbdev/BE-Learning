'use strict';

const { BadRequestError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { order } = require("../models/order.model");
const { findCardById } = require("../models/repositories/card.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, realeaseLock } = require("./redis.service");

class CheckoutService {


    /**
     * Check out review
        
    {
        cartId, userId, 
        shop_order_ids [
            {
        "cartId":"66c4d36b7bcc73a85afdecad",
        "userId": "5", 
        "shop_order_ids": [
            {
            "shopId": "",
            "shop_discounts": [],
            "item_products": [
                   {
                        "productId": "",
                        "quantity": "",
                        "price": ""
                    }
                ]
            },
            {
            "shopId": "",
            "shop_discounts": [
                {
                    "shop_id": "",
                    "discountId": "",
                    "codeId": ""

                }
            ],
            "item_products": [
                   {
                        "productId": "",
                        "quantity": "",
                        "price": ""
                    }
                ]
            }
        ]
    }
        ]
    }

     
     */

    static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
        //check cardId ton tai hay khong
        const foundCart = await findCardById(cartId);
        if (!foundCart) throw new BadRequestError('Cart not exists');

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []

        //tinh tong tien bill

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            // check product available

            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductServer[0]) {
                throw new BadRequestError(`Order wrong!!`)
            }

            //tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            //Tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, //tien trc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // new shop_discounts ton tai > 0, check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su chi co 1 discount
                // get amount discount

                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId: userId,
                    shopId: shopId,
                    products: checkProductServer
                })

                //tong discount orders
                checkout_order.totalDiscount += discount

                //neu tien giam gia lon hon 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            //tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount

            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        userId,
        cartId,
        shop_order_ids,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        //check lai xem vuot ton kho hay khong
        //get new array products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await realeaseLock(keyLock)
            }
        }
        // check lai neu co 1 san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay tro lai gio hang...')
        }

        const newOrder = new order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })

        // truong hop insert thanh cong, thi remove product co trong gio hang
        if (newOrder) {
            //remove product in my cart
        }

        return newOrder

    }

    /**
        Query Orders [Users]
     */

    static async getOrdersByUser() {

    }

    /**
        Query Orders Using Id [Users]
     */

    static async getOneOrderByUser() {

    }

    /**
        Cancel Orders [Users]
     */

    static async cancelOrderByUser() {

    }

    /**
    Update Orders Status [Shop | Admin]
 */

    static async updateOrderStatusByShop() {

    }
}
module.exports = CheckoutService;
