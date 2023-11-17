const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    orderDate: Date,
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu'
            },
            quantity: Number
        }
    ],
    deliveryAddress: {
        city: String,
        district: String,
        street: String
    }
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;