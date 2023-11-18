const { isValidObjectId } = require('mongoose');
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');
const Review = require('../models/Review');
const { RESTAURANT_TYPES } = require('../constants');

const createRestaurant = async (req, res) => {
    const { name, description, address, location, categories } = req.body;
    try {
        const restaurant = await Restaurant.create({
            name,
            address,
            location,
            description,
            owner: req.user._id,
            category: categories && categories.length > 0 ? categories : [RESTAURANT_TYPES.OTHER]

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
        sortField = "avarageRating",
        sortOrder = 'desc',
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




const updateRestaurant = async (req, res) => {

    const { id } = req.params;
    const updatableFields = ['name', 'address'];
    const updates = req.body;

    try {

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid Restaurant Id',
            });
        }

        // check for updates fields in updatableFields

        const updatesFields = Object.keys(updates);
        const isValidOperation = updatesFields.every((update) =>
            updatableFields.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).json({
                message: 'Invalid updates!',
            });
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        return res.status(200).json({
            restaurant: updatedRestaurant,
            message: 'Restaurant updated successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


const deleteRestaurant = async (req, res) => {
    const { id } = req.params;

    try {
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid Restaurant Id',
            });
        }

        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

        if (!deletedRestaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        return res.status(200).json({
            restaurant: deletedRestaurant,
            message: 'Restaurant deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// NOTE : PROBLEM 2 SOLUTION
const getNearbyRestaurants = async (req, res) => {

    const {
        page = 1,
        limit = 5,
        search,
        sortField = 'location.distance',
        sortOrder = 'asc',
    } = req.query;


    const { lat, lng } = req.body;

    try {

        const regex = new RegExp(search, 'i');



        const searchConditions = {
            $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
        };

        const pipeline = [
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    distanceField: 'location.distance',

                    spherical: true,
                    // use the index created in the model location field 
                    key: 'location',
                },
            },
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
                limit: parseInt(limit),
                count: restaurants.length,
                total: count
            },

            message: 'Restaurants fetched successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const addNewMenu = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        items
    } = req.body;
    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        const newMenu = await Menu.create({
            restaurantId: id,
            ...menu
        });

        restaurant.menus.push(newMenu._id);

        await restaurant.save();

        const populatedRestaurant = await Restaurant.findById(id).populate('menus');

        return res.status(201).json({
            restaurant: populatedRestaurant,
            message: 'Menu created successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}



// NOTE : PROBLEM 3 SOLUTION
// add multimple menus to a restaurant using mongoose transaction api 
const addNewMenus = async (req, res) => {

    const { id } = req.params;
    // STEP 1 : create a session
    const session = await Menu.startSession();

    // STEP 2 : start transaction 
    session.startTransaction();



    try {

        // STEP 3 : check if restaurant exists and
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        // STEP 4 : check menu and menu items are valid 
        const menus = req.body;

        const menuIds = [];

        for (const menu of menus) {
            const newMenu = await Menu.create([{
                restaurantId: id,
                ...menu
            }], { session });

            menuIds.push(newMenu._id);
        }

        restaurant.menus.push(...menuIds);

        await restaurant.save({ session });

        // STEP 5 : commit the transaction
        await session.commitTransaction();
    } catch (error) {

        // Rollback any changes made in the database
        await session.abortTransaction();
        return res.status(500).json({
            message: error.message
        });
    } finally {
        // Ending the session
        await session.endSession();
    }
}


// NOTE : PROBLEM 4 SOLUTION
const getReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, sortField = 'age', sortOrder = 'desc' } = req.query;
        const USER_COLLECTION = 'users';

        const regex = new RegExp(search, 'i');

        const searchConditions = {
            $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
        };

        const genderBasedPipeline = [
            { $match: searchConditions },
            { $lookup: { from: USER_COLLECTION, localField: 'user', foreignField: '_id', as: 'userDetails' } },
            { $match: { 'userDetails.gender': 'male' } },
            { $sort: { createdAt: -1 } }
        ];

        const pipeline = [
            { $limit: limit },
            { $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 } },
            { $skip: (page - 1) * limit }
        ];

        const combinedPipeline = [...genderBasedPipeline, ...pipeline];

        const users = await Review.aggregate(combinedPipeline);
        const count = await Review.aggregate(genderBasedPipeline).count('count');

        return res.status(200).json({
            users,
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                count: users.length,
                total: count
            },
            message: 'Restaurant fetched successfully'
        });
    } catch (error) {
        next(error);
    }
}

// NOTE : PROBLEM 5 SOLUTION
const getFilteredReviews = async (req, res, next) => {
    const { page = 1, limit = 20, search = "fast", sortField = 'age', sortOrder = 'desc' } = req.query;

    const regex = new RegExp(search, 'i');

    const mainPipeline = [
        {
            $match: {

                $or: [
                    { category: { $in: [RESTAURANT_TYPES.FAST_FOOD, RESTAURANT_TYPES.HOMEMADE] } },
                    { title: { $regex: regex } },
                    { description: { $regex: regex } }
                ],
                averageRating: { $gte: 4 }
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                categories: 1,
                description: 1
            }
        },
        { $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];

    try {
        const restaurants = await Restaurant.aggregate(mainPipeline);
        const count = await Restaurant.aggregate(mainPipeline.slice(0, 2)).count('count');

        return res.status(200).json({
            restaurants,
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                count: restaurants.length,
                total: count
            },
            message: 'Restaurant fetched successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}




module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getNearbyRestaurants,
    addNewMenu,
    addNewMenus,
    getReviews,
    getFilteredReviews
}