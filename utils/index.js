const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker')
const Restaurant = require('../models/Restaurant');
const { RESTAURANT_TYPES } = require('../constants');


const isValidObjectID = (id) => mongoose.Types.ObjectId.isValid(id);



// Function to generate mock data for a restaurant
const generateMockRestaurant = () => {
    const restaurantTypes = Object.values(RESTAURANT_TYPES);
    const randomType = RESTAURANT_TYPES.OTHER

    console.log(randomType);

    return {
        name: `Restaurant ${Math.floor(Math.random() * 100)}`,
        description: `Description for Restaurant ${Math.floor(Math.random() * 100)}`,
        logo: 'https://via.placeholder.com/150',
        address: {
            city: 'City',
            district: 'District',
            street: 'Street',
        },
        location: {
            type: 'Point',
            coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90],
        },
        branches: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
            address: {
                city: 'City',
                district: 'District',
                street: 'Street',
            },
            location: {
                type: 'Point',
                coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90],
            },
        })),
        menus: [], // You can add menu data if needed
        category: [randomType],
        avarageRating: Math.floor(Math.random() * 5) + 1,
    };
};

// Function to generate and save mock data
const generateAndSaveMockData = async () => {
    const mockData = Array.from({ length: 10 }, generateMockRestaurant);

    try {
        await Restaurant.create(mockData);
        console.log('Mock data created successfully');
    } catch (error) {
        console.error('Error creating mock data:', error);
    }
};


module.exports = { isValidObjectID, generateAndSaveMockData, generateMockRestaurant };