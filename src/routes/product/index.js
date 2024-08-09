'use strict';

const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');


// Authentication
router.use(authenticationV2)
// Logout
router.post('',asyncHandler(ProductController.createProduct));






module.exports = router