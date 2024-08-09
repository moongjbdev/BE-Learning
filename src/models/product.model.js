'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    });



// define the product type = 'clothing'

const clothingSChema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}
},
    {
        collection: 'clothes',
        timestamps: true,
    }
)
// define the product type = 'electronic'

const electronicSChema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}

},
    {
        collection: 'electronics',
        timestamps: true,
    }
)

const furnitureSChema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}

},
    {
        collection: 'furnitures',
        timestamps: true,
    }
)

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSChema),
    electronic: model('Electronic', electronicSChema),
    furniture: model('Furniture', furnitureSChema),

}
