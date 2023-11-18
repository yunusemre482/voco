const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../constants');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
        }
    ],
    total: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    deliveryAddress: {
        city: String,
        district: String,
        street: String
    },
    status: {
        type: String,
        enum: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELED, ORDER_STATUS.DELIVERED],
        default: ORDER_STATUS.PENDING
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;