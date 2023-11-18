const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    description: {
        type: String,
        default: '',
        maxlength: 150,
    },
    price: {
        type: Number,
        default: 0,
    },
    discountInPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    images: [{
        type: String,
        default: 'https://via.placeholder.com/150'
    }],
    category: {
        type: String,
        default: 'Other'
    },

}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
