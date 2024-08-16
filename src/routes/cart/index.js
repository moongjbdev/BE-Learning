'use strict';

const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/cart.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');

//get amount a discount

router.post('', asyncHandler(CartController.addToCart));
router.delete('', asyncHandler(CartController.delete));
router.post('/update', asyncHandler(CartController.update));
router.get('', asyncHandler(CartController.listToCart));



module.exports = router;