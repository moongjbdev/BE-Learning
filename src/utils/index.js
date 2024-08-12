'use strict';

const _ = require('lodash')

const getInforData = ({ fields = [], object = {}}) => {
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

module.exports = {
    getInforData,
    getSelectData,
    getUnSelectData
}