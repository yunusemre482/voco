const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
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
  logo: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  address: {
    city: String,
    district: String,
    street: String,
    latitude: Number,
    longitude: Number
  },
  branches: [
    {
      city: String,
      district: String,
      street: String,
      latitude: Number,
      longitude: Number
    }
  ]
}, {
  timestamps: true,
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;