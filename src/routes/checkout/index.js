'use strict';

const express = require('express');
const router = express.Router();
const CheckoutController = require('../../controllers/checkout.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');

//get amount a discount

router.post('/review', asyncHandler(CheckoutController.checkoutReview));




module.exports = router;