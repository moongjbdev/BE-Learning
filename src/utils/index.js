'use strict';

const _ = require('lodash')
const { Types } = require('mongoose');



const getInforData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

// ["a", "b", "c"] => {a: 1, b: 1, c: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

// ["a", "b", "c"] => {a: 0, b: 0, c: 0}
const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefindObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })

    return obj
}

// {
//     name: "John",
//     address: {
//         city: "New York",
//         coordinates: {
//             lat: 40.7128,
//             long: 74.0060
//         }
//     },
//     hobbies: ["reading", "traveling"]
// }; =====>  
//     {
//         name: "John",
//         "address.city": "New York",
//         "address.coordinates.lat": 40.7128,
//         "address.coordinates.long": 74.0060,
//         hobbies: ["reading", "traveling"]
//     }

const updateNestedObject = (obj) => {
    const final = {};

    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObject(obj[k]);
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    console.log('check final', final);
    return final;

}

const convertToOnjectIdMongodb = (id) => {
    return Types.ObjectId(id)
}

module.exports = {
    getInforData,
    getSelectData,
    getUnSelectData,
    removeUndefindObject,
    updateNestedObject,
    convertToOnjectIdMongodb
}