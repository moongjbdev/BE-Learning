'use strict';

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {

        createProduct = async (req, res, next) => {
            
        new SuccessResponse({
            message: 'Create new Product successfully!',
            metadata: await ProductService.createProduct(
                req.body.product_type,
                req.body
            )
        }).send(res);
    }

    
}

module.exports = new ProductController;