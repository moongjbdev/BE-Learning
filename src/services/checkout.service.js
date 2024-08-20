'use strict';

const { BadRequestError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { findCardById } = require("../models/repositories/card.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

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
}
module.exports = CheckoutService;
