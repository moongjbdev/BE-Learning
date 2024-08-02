require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const {default: helmet} = require('helmet');
const compression = require('compression')


// Middleware 
app.use(morgan('combined')) // notification when api is called
app.use(helmet()) //hide tech
app.use(compression()) //use less bandwidth
app.use(express.json()) // parse json request
app.use(express.urlencoded({ extended: true })) // parse urlencoded request

// Database
require('./databases/init.mongodb')
const {checkOverload} = require('./helpers/check.connect')
// checkOverload()
//Routes
app.use('', require('./routes/index'))

// Handle Error

module.exports = app;