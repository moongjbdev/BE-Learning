'use strict';

const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
var OrderSchema = new Schema({
    order_userId: { type: Number, required: true },

    /**
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
     */

    order_checkout: { type: Object, default: {} },
    /**
        order_shipping = {
            street,
            city,
            state,
            country
        }
     */
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true, default: [] },
    order_trackingNumber: { type: String, default: '#0000122082024' },
    order_status: { type: String, enum: ['pending', 'comfirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' },


},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    });

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, OrderSchema)
} 