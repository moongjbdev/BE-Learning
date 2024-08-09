'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic } = require('../models/product.model')

// Function to create a new product based on type
async function createProduct(type, payload) {
    console.log('check payload', payload)
    switch (type) {
        case 'Clothing':
            return createClothingProduct(payload)
        case 'Electronic':
            return createElectronicProduct(payload)
        default:
            throw new BadRequestError(`Invalid product type`)
    }
}

// Function to create a new base product
async function createBaseProduct({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
}) {
    return await product.create({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    })
}

// Function to create a new clothing product
async function createClothingProduct(payload) {
    const { product_attributes } = payload

    const newClothing = await clothing.create(product_attributes)
    if (!newClothing) throw new BadRequestError('Create new Clothing failed')

    const newProduct = await createBaseProduct(payload)
    if (!newProduct) throw new BadRequestError('Create new Product failed')

    return newProduct
}

// Function to create a new electronic product
async function createElectronicProduct(payload) {
    const { product_attributes } = payload

    const newElectronic = await electronic.create(product_attributes)
    if (!newElectronic) throw new BadRequestError('Create new Electronics failed')

    const newProduct = await createBaseProduct(payload)
    if (!newProduct) throw new BadRequestError('Create new Product failed')

    return newProduct
}

module.exports = {
    createProduct
}
