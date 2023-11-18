const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  name: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]

}, {
  timestamps: true,
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;