"use strict";

const { BadRequestError } = require("../core/error.response");
const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model");
const { findAllDraftForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductsByUser, findAllProducts, findProduct, updateProductById } = require("../models/repositories/product.repo");
const { removeUndefindObject, updateNestedObject } = require("../utils");

// define Factory class to create product

class ProductFactory {
    /*
          type: ,
          payload
      */
    // static async createProduct(type, payload) {
    //     switch (type) {
    //         case "Clothing":
    //             return new Clothing(payload).createProduct();
    //         case "Electronic":
    //             return new Electronic(payload).createProduct();
    //         case "Furniture":
    //             return new Furniture(payload).createProduct();
    //         default:
    //             throw new BadRequestError(`Invalid product type`);
    //     }
    // }

    static productRegistry = {} // key-class

    static registerProduct(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) return new BadRequestError('Invalid product type')

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) return new BadRequestError('Invalid product type')
        return new productClass(payload).updateProduct(productId)
    }






    // ##### QUERY PRODUCT #####
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    // ##### PUT PRODUCT #####
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    static async searchProducts({ keySearch }) {
        return await searchProductsByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
    }
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
}

//define base product class

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // create new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id });
    }

    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

//  ########  define sub-class for different product types Clothing   ########

class Clothing extends Product {
    // override createProduct method to add clothing specific attributes
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) throw new BadRequestError("Create new Clothing failed");

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError("Create new Product failed");

        return newProduct;
    }

    async updateProduct(productId) {
        /**
         * 
         */
        //remove attributes has null underfined
        //check update o dau?
        console.log('check this []', this)
        const objectParams = removeUndefindObject(this)
        console.log('check before this []', objectParams)
        if (objectParams.product_attributes) {
            //update child
            await updateProductById({ productId, bodyUpdate: objectParams, model: clothing })

        }

        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

//define sub-class for different product types Electronics

class Electronic extends Product {
    // override createProduct method to add electronic specific attributes
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic)
            throw new BadRequestError("Create new Electronics failed");

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("Create new Product failed");

        return newProduct;
    }

    async updateProduct(productId) {
        /**
         * 
         */
        //remove attributes has null underfined
        //check update o dau?
        const objectParams = removeUndefindObject(this)
        if (objectParams.product_attributes) {
            //update child
            await updateProductById({ productId, bodyUpdate: updateNestedObject(objectParams.product_attributes), model: electronic })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObject(objectParams))
        return updateProduct
    }
}

class Furniture extends Product {
    // override createProduct method to add electronic specific attributes
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture)
            throw new BadRequestError("Create new Electronics failed");

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError("Create new Product failed");

        return newProduct;
    }
}


// register product types
ProductFactory.registerProduct('Electronic', Electronic);
ProductFactory.registerProduct('Clothing', Clothing);
ProductFactory.registerProduct('Furniture', Furniture);


module.exports = ProductFactory;
