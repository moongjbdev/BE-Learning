'use strict';

const mongoose = require('mongoose');
const _SECONDS = 5000
const os = require('os')
const process = require('process')


//count connections
const countConnect = () => {
    const numConnections = mongoose.connections.length;
console.log(`Number of onnections: ${numConnections}`)
}

//check over load connection
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUse = process.memoryUsage().rss;

        // Example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`)
        console.log(`Memory usage: ${memoryUse/ 1024 / 1024} MB`)

        if (numConnections >= maxConnections) {
            console.log(`Overload detected! Number of connections: ${numConnections}, Max connections: ${maxConnections}`);
        }

    },_SECONDS) //Monitor every 5 seconds
}
module.exports = {
    countConnect,
    checkOverload
}