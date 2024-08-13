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

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update product successfully!',
            metadata: await ProductServiceV2.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
                
            )
        }).send(res);
    }


    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Published successfully!',
            metadata: await ProductServiceV2.publishProductByShop(
                {
                    product_shop: req.user.userId,
                    product_id: req.params.id
                }
                
            )
        }).send(res);
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update unPublished successfully!',
            metadata: await ProductServiceV2.unPublishProductByShop(
                {
                    product_shop: req.user.userId,
                    product_id: req.params.id
                }
                
            )
        }).send(res);
    }




    // Query //
    /**
     *  Comments //
     * @description Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * ...
     * @return {JSON} next 
     */

    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft successfully!',
            metadata: await ProductServiceV2.findAllDraftForShop({ product_shop: req.user.userId })
        }).send(res);
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish successfully!',
            metadata: await ProductServiceV2.findAllPublishForShop({ product_shop: req.user.userId })
        }).send(res);
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish successfully!',
            metadata: await ProductServiceV2.findAllPublishForShop({ product_shop: req.user.userId })
        }).send(res);
    }

    getListSearchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search successfully!',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list all successfully!',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product successfully!',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res);
    }
    
    
    

    // End Query


}

module.exports = new ProductController;