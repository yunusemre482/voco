const { isValidObjectId } = require('mongoose');
const Restaurant = require('../models/restaurant.model');



const createRestaurant = async (req, res) => {
    const { name, address } = req.body;
    try {
        const restaurant = await Restaurant.create({
            name,
            address
        });
        return res.status(201).json({
            success: true,
            data: restaurant,
            message: 'Restaurant created successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        });
    }
}

const getAllRestaurants = async (req, res) => {

    const {
        search,
        page = 1,
        limit = 10,
        sortField,
        sortOrder = 'asc',
    } = req.query;


    try {
        const regex = new RegExp(search, 'i');

        // NOTE : This is the query builder pattern for mongoose queries 
        // const conditions = [];
        // if (search) {
        //   // Split the search parameter into field:value pairs
        //   const searchPairs = search.split(',');

        //   // Loop through the searchPairs and build search conditions
        //   searchPairs.forEach((searchPair) => {
        //     const [field, value] = searchPair.split(':');
        //     const condition = {};
        //     condition[field] = { $regex: new RegExp(value, 'i') };
        //     conditions.push(condition);
        //   });
        // }
        // Combine all search conditions using $or
        // const searchConditions = { $or: conditions };
        const searchConditions = {
            $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
        };

        const pipeline = [
            { $match: searchConditions },
            { $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 } },
            { $skip: (page - 1) * parseInt(limit) },
            { $limit: parseInt(limit) },
        ];
        const restaurants = await Restaurant.aggregate(pipeline);
        const count = await Restaurant.countDocuments();


        return res.status(200).json({
            restaurants,
            meta: {
                page: parseInt(page),
                totalPage: Math.ceil(count / limit),
                limit: parseInt(limit),
                total: count,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: error.message
        });
    }
}





const getRestaurantById = async (req, res) => {
    const { id } = req.params;
    try {
        // check for valid id 
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid Restaurant Id',
            });
        }

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        return res.status(200).json({
            restaurant,
            message: 'Restaurant fetched successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


const getNearbyRestaurants = async (req, res) => {
    const { lat, lng } = req.query;

    try {
        const restaurants = await Restaurant.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        return res.status(200).json({
            restaurants,
            message: 'Restaurants fetched successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
