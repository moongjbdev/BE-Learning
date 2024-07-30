const express = require('express');
const app = express();
const morgan = require('morgan');
const {default: helmet} = require('helmet');
const compression = require('compression')


// Middleware 
app.use(morgan('combined'))
app.use(helmet())
app.use(compression())
    
// Database

//Routes
app.get('/', (req, res) => {
   return res.status(404).json({
    message: "Hello, world!"
   })
})
// Handle Error

module.exports = app;