'use strict';

const { getUnSelectData, getSelectData } = require("../../utils");


const findAllDiscountCodesUnselected = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, unselect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter).
        sort(sortBy).
        skip(skip).
        limit(limit).
        select(getUnSelectData(unselect)).
        lean()

    return documents
}

const findAllDiscountCodesSelected = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter).
        sort(sortBy).
        skip(skip).
        limit(limit).
        select(getSelectData(select)).
        lean()

    return documents
}


const checkDiscountExists = async ({ model, filter }) => {
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodesUnselected,
    findAllDiscountCodesSelected,
    checkDiscountExists
}