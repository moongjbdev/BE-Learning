'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { discount } = require('../models/discount.model');
const { findAllDiscountCodesUnselected, checkDiscountExists } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToOnjectIdMongodb } = require('../utils');
/**
    1. generate discount code [Shop | Admin]
    2. Get discount amount [Users]
    3. Get all discount codes [Users | Shop]
    4. verify discount code [users]
    5. delete discount code [shop \ admin]
    6. cancel discount code [users]
 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to,
            name, description, type, max_value, max_uses, uses_count, max_uses_per_user, value, users_used
        } = payload;

        //Kiem tra

        if (new Date(start_date) > new Date(end_date)) {
            throw BadRequestError(`Start day must be before end day!`)
        }

        //create index for discount code
        const foundDiscountCode = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToOnjectIdMongodb(shopId),

        }).lean()

        if (foundDiscountCode && foundDiscountCode.discount_is_active) {
            throw new BadRequestError(`Discount code '${code}' already exists!`)
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_user_count: uses_count,
            discount_users_used: users_used,
            discount_shop_id: shopId,
            discount_max_uses_per_user: max_uses_per_user,

            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to == 'all' ? [] : product_ids
        })

        return newDiscount;

    }

    static async updateDiscount() {
        //....
    }

    //get all discount available with products
    static async getAllDiscountCodesWithProducts({ code, shopId, userId, limit = 50, page = 1 }) {
        //create index for discount code
        const foundDiscountCode = await discount.findOne({
            discount_code: code,
            discount_shop_id: convertToOnjectIdMongodb(shopId),

        }).lean()

        if (!foundDiscountCode || !foundDiscountCode.discount_is_active) {
            throw new NotFoundError(`Discount code '${code}' not exists!`)
        }

        const { discount_applies_to, discount_product_ids } = foundDiscountCode

        let products

        if (discount_applies_to == 'all') {
            // get all product

            products = await findAllProducts(
                {
                    limit: +limit,
                    sort: 'ctime',
                    page: +page,
                    filter: {
                        product_shop: convertToOnjectIdMongodb(shopId),
                        isPublished: true,

                    },
                    select: ['product_name']

                })

            return products
        }
        if (discount_applies_to == 'specific') {
            // get product by ids

            products = await findAllProducts(
                {
                    limit: +limit,
                    sort: 'ctime',
                    page: +page,
                    filter: {
                        _id: { $in: foundDiscountCode.discount_product_ids },
                        isPublished: true,

                    },
                    select: ['product_name']

                })

            return products
        }
    }

    //get all discount of shop
    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        console.log("check log ====", limit, page, shopId)
        const discounts = await findAllDiscountCodesUnselected({
            limit: +limit,
            page: +page,
            sort: 'ctime',
            filter: {
                discount_shop_id: convertToOnjectIdMongodb(shopId),
                discount_is_active: true,
            },
            unselect: ['__v', 'discount_shop_id'],
            model: discount
        })

        return discounts;
    }
    /*
        Apply Discount Code
        products = [
            {
                productId,
                shopId,
                quantity,
                name,
                price
            },
            {
                productId,
                shopId,
                quantity,
                name,
                price
            }
        ]
    */
    static async getDiscountAmount({ codeId, shopId, userId, products }) {
        const foundDiscountCode = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shop_id: convertToOnjectIdMongodb(shopId)
            }
        })

        if (!foundDiscountCode) throw new NotFoundError(`Discount code not found`);

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_end_date,
            discount_value
        } = foundDiscountCode

        if (!discount_is_active) {
            throw new NotFoundError(`Discount expried! `)
        }

        if (discount_max_uses <= 0) {
            throw new NotFoundError(`All discount uses has been used!`)
        }
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError(`Discount code has expired!`)
        }
        // check xem co set gia tri toi thieu hay khong?
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError(`Discount requires a minium order value of ${discount_min_order_value}`)
            }
        }

        // if (discount_max_uses_per_user > 0) {
        //     const userUserDiscount = discount_users_used.find(user => user.userId === userId)
        //     if (userUserDiscount) {
        //         //...
        //     }

        // }

        // check xem la amount hay percent
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }

    static async deleteDiscountCode({ codeId, shopId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shop_id: convertToOnjectIdMongodb(shopId),
        })
        return deleted
    }

    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscountCode = await checkDiscountExists(discount, {
            discount_code: codeId,
            discount_shopId: convertToOnjectIdMongodb(shopId),
        })
        if (!foundDiscountCode) throw new NotFoundError(`Discount code not found`);

        // if (foundDiscountCode.discount_users_used.find(user => user.userId === userId)) {
        //     throw new BadRequestError(`Discount code has been used by this user!`)
        // }

        const result = await discount.findByIdAndUpdate(foundDiscountCode._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_user_count: -1,
            },
        })
        return result
    }
}

module.exports = DiscountService;