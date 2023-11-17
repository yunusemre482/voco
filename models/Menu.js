const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  name: String,
  items: [
    {
      itemName: String,
      price: Number,
      description: String
    }
  ]
},
  {
    timestamps: true,
  });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;