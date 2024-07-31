const mongoose = require('mongoose');

const connectString = `mongodb://localhost:27017/shopDev`
mongoose.connect(connectString)
.then(() => console.log("connected to database successfully"))
.catch(() => console.log("Connection to database failed"));

//dev 
if(1 === 1){
    mongoose.set('debug', true);
    mongoose.set('debug', {color: true});
}

module.exports = mongoose