'use strict';

const express = require('express');
const router = express.Router();
const DiscountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');

//get amount a discount

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProducts));

router.use(authenticationV2)

router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodesByShop))


module.exports = router;