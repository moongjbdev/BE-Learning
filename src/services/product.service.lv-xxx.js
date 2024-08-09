"use strict";

const { BadRequestError } = require("../core/error.response");
const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model");

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
        if(!productClass) return new BadRequestError('Invalid product type')

        return new productClass(payload).createProduct()
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
}

//define sub-class for different product types Clothing

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
