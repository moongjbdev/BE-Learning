'use strict';

const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');



// Sign Up
router.post('/shop/signup',asyncHandler(AccessController.signUp));

// Sign In
router.post('/shop/signin',asyncHandler(AccessController.signIn));


// Authentication
router.use(authentication)
// Logout
router.post('/shop/logout',asyncHandler(AccessController.logout));





module.exports = router