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
            name, description, type, max_value, max_uses, uses_count, max_uses_per_user
        } = payload;

        //Kiem tra

        if (new Date() > new Date(start_date) || new Date(end_date) < new Date()) {
            throw BadRequestError(`Discount code has expired!`)
        }

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
    static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit = 50, page = 1 }) {
        //create index for discount code
        const foundDiscountCode = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToOnjectIdMongodb(shopId),

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
        const discounts = await findAllDiscountCodesUnselected({
            limit: +limit,
            page: +page,
            sort: 'ctime',
            filter: {
                discount_shopId: convertToOnjectIdMongodb(shopId),
                discount_is_active: true,
            },
            unselect: ['__v', 'discount_shopId'],
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
        const foundDiscountCode = await checkDiscountExists(discount, {
            discount_code: codeId,
            discount_shopId: convertToOnjectIdMongodb(shopId),
        })
        if (!foundDiscountCode) throw new NotFoundError(`Discount code not found`);

        const { discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_min_order_value
        } = foundDiscountCode

        if (!discount_is_active) {
            throw new NotFoundError(`Discount expried! `)
        }

        if (!discount_max_uses) {
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

            }, 0)
        }
    }

}