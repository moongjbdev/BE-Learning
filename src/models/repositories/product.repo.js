'use strict';

const { product, electronic, clothing, furniture } = require('../../models/product.model');
const {Types} = require('mongoose');
const { getSelectData, getUnSelectData } = require('../../utils');

// =================================================================


const findAllDraftForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}
// Gop 2 thang tren thanh 1
const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query).
    populate('product_shop', 'name email -_id').
    sort({updateAt: -1}).
    skip(skip).
    limit(limit).
    lean().
    exec()
}

const searchProductsByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch, 'i')
    const results = await product.find(
        {isPublished: true, $text: { $search: regexSearch}}, 
        {score: {$meta: 'textScore'}}
    ).sort({ score: { $meta: 'textScore' } }).lean()

    return results
}


const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find(filter).
        sort(sortBy).
        skip(skip).
        limit(limit).
        select(getSelectData(select)).
        lean()
    return products
}

const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect))
}



// PUT
const publishProductByShop = async ({product_shop, product_id}) => {
    // const foundShop = await product.findOne({
    //     product_shop: new Types.ObjectId(product_shop),
    //     _id: new Types.ObjectId(product_id),
    // })

    // if (!foundShop) {
    //     return null;
    // }

    // foundShop.isDraft = false;
    // foundShop.isPublished = true;

    // const {modifiedCount} = foundShop.update(foundShop) // update = 1 , ko update = 0

    // return modifiedCount

    const foundShop = await product.findOneAndUpdate(
        {
            product_shop: new Types.ObjectId(product_shop),
            _id: new Types.ObjectId(product_id),
        },
        {
            $set: {
                isDraft: false,
                isPublished: true,
            }
        },
        { new: true } // Return the updated document
    );
    if (!foundShop) {
        return null;
    }
    return 1;
}

const unPublishProductByShop = async ({product_shop, product_id}) => {

    const foundShop = await product.findOneAndUpdate(
        {
            product_shop: new Types.ObjectId(product_shop),
            _id: new Types.ObjectId(product_id),
        },
        {
            $set: {
                isDraft: true,
                isPublished: false,
            }
        },
        { new: true } // Return the updated document
    );
    if (!foundShop) {
        return null;
    }
    return 1;
}



module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct
};
