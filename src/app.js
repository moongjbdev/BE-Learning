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

// Database
require('./databases/init.mongodb')
const {checkOverload} = require('./helpers/check.connect')
checkOverload()
//Routes
app.get('/', (req, res) => {
   return res.status(404).json({
    message: "Hello, world!"
   })
})
// Handle Error

module.exports = app;