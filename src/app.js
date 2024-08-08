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


//Routes
app.use('', require('./routes/index'))

//             Handle Error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error <3 MoongJB ',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error',
    })
})
module.exports = app;