'use strict';

const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');



// Sign Up
router.post('/shop/signup',asyncHandler(AccessController.signUp));




module.exports = router