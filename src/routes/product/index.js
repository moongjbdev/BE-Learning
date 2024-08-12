'use strict';

const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');


router.get('/search/:keySearch',asyncHandler(ProductController.getListSearchProducts));
router.get('',asyncHandler(ProductController.findAllProducts));
router.get('/:product_id',asyncHandler(ProductController.findProduct));




// Authentication
router.use(authenticationV2)
////////////////////////////////////////////////////////////////
router.post('',asyncHandler(ProductController.createProduct));
router.post('/publish/:id',asyncHandler(ProductController.publishProductByShop));
router.post('/unpublish/:id',asyncHandler(ProductController.unPublishProductByShop));



// Query //
router.get('/drafts/all',asyncHandler(ProductController.getAllDraftForShop));
router.get('/published/all',asyncHandler(ProductController.getAllPublishForShop));








module.exports = router