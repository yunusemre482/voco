const mongoose = require('mongoose');
const { RESTAURANT_TYPES } = require('../constants');


const restaurantSchema = new mongoose.Schema({
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
  logo: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  address: {
    city: String,
    district: String,
    street: String,
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },

  branches: [
    {
      address: {
        city: String,
        district: String,
        street: String,
      },
      location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
      },
    }
  ],
  avarageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu'
    }
  ],
  category: [
    {
      type: String,
      enum: [RESTAURANT_TYPES.OTHER, RESTAURANT_TYPES.BAKERY, RESTAURANT_TYPES.CAFE, RESTAURANT_TYPES.RESTAURANT, RESTAURANT_TYPES.BAR, RESTAURANT_TYPES.HOMEMADE],
      default: RESTAURANT_TYPES.OTHER

    }
  ]
}, {
  timestamps: true,
});

restaurantSchema.index({ location: '2dsphere' }); // İlave: Spatial Index for location field
restaurantSchema.index({
  'branches.location': '2dsphere',
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;