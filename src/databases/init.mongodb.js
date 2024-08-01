'use strict';
const { db: {host, name, port}} = require('../configs/config.mongodb')

const mongoose = require('mongoose');
const connectString = `mongodb://${host}:${port}/${name}`
const { countConnect } = require('../helpers/check.connect')



class Database {
    constructor(){
        this.connect()
    }
    
    //connect
    connect(type = 'mongodb') {
        //dev
        if(1 === 1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        
        mongoose.connect(connectString, {maxPoolSize: 50})
           .then(() => {
            console.log(`Connected to ${type} database successfully PRO ${name} `), 
            countConnect()
        }).catch(() => console.log(`Connection to ${type} database failed`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}


const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb