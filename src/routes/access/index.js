'use strict';

const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');



// Sign Up
router.post('/shop/signup',asyncHandler(AccessController.signUp));

// Sign In
router.post('/shop/signin',asyncHandler(AccessController.signIn));


// Authentication
router.use(authenticationV2)
// Logout
router.post('/shop/logout',asyncHandler(AccessController.logout));
router.post('/shop/handlerRefreshToken',asyncHandler(AccessController.handlerRefreshToken));






module.exports = router