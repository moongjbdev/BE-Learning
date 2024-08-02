'use strict';

const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller')
// Sign Up
router.post('/shop/signup', AccessController.signUp);




module.exports = router