'use strict';

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.lv-xxx");


class ProductController {

    //     createProduct = async (req, res, next) => {
    //         console.log("check =========", req.user)
            
    //     new SuccessResponse({
    //         message: 'Create new Product successfully!',
    //         metadata: await ProductService.createProduct(
    //             req.body.product_type,
    //             {
    //             ...req.body,
    //             product_shop: req.user.userId

    //             }
    //         )
    //     }).send(res);
    // }

    createProduct = async (req, res, next) => {
        
    new SuccessResponse({
        message: 'Create new Product successfully!',
        metadata: await ProductServiceV2.createProduct(
            req.body.product_type,
            {
            ...req.body,
            product_shop: req.user.userId
            }
        )
    }).send(res);
}

    
}

module.exports = new ProductController;