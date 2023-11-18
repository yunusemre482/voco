const { ORDER_STATUS } = require('../constants');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');



const createOrder = async (req, res) => {
    // NOTE : req.user is set by the auth middleware we should have a user logged in 
    const { id: userId } = req.user;

    const { restaurant, items, deliveryAddress } = req.body;

    try {


        // TODO : check if the restaurant is open

        // TODO : check if the restaurant is in the same city as the user

        // TODO : check if the restaurant is in the same district as the user

        // check if restaurant is valid
        if (!isValidObjectId(restaurant)) {
            return res.status(400).json({
                message: 'Invalid Restaurant Id',
            });
        }

        // check if restaurant exists

        const restaurantExists = await Restaurant.exists({ _id: restaurant });

        if (!restaurantExists) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        // check if items are valid
        const itemsAreValid = items.every(item => isValidObjectId(item._id));

        if (!itemsAreValid) {
            return res.status(400).json({
                message: 'Invalid items',
            });
        }

        // check if items exists
        const itemsExists = await Product.exists({ _id: { $in: items.map(item => item._id) } });

        if (!itemsExists) {
            return res.status(404).json({
                message: 'Items not found',
            });
        }

        // check if items are available
        const itemsAreAvailable = await Product.find({
            _id: { $in: items.map(item => item._id) },
            available: true
        });

        if (!itemsAreAvailable) {
            return res.status(404).json({
                message: 'Items not available',
            });
        }

        // check if items are in the restaurant menu
        const itemsAreInMenu = await Menu.exists({
            restaurant,
            products: { $in: items.map(item => item._id) }
        });

        if (!itemsAreInMenu) {
            return res.status(404).json({
                message: 'Items not in menu',
            });
        }


        // create order 
        const order = new Order({
            user: userId,
            restaurant,
            items,
            deliveryAddress
        });

        await order.save();

        return res.status(201).json({
            order,
            message: 'Order created successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const cancelOrder = async (req, res) => {
    // NOTE : req.user is set by the auth middleware we should have a user logged in
    const { id: userId } = req.user;

    const { id } = req.params;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
            });
        }

        if (order.user !== userId) {
            return res.status(403).json({
                message: 'Forbidden! You are not the owner of this order',
            });
        }

        if (order.status !== ORDER_STATUS.PENDING) {
            return res.status(400).json({
                message: 'Order is already confirmed or delivered',
            });
        }

        order.status = ORDER_STATUS.CANCELLED;

        await order.save();

        return res.status(200).json({
            order,
            message: 'Order canceled successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getRestaurantOrders = async (req, res) => {
    // NOTE : req.user is set by the auth middleware we should have a user logged in
    const { id: userId } = req.user;
    const { id } = req.params;

    try {
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        if (restaurant.owner !== userId) {
            return res.status(403).json({
                message: 'Forbidden! You are not the owner of this restaurant',
            });
        }

        const orders = await Order.find({ restaurant: id });

        return res.status(200).json({
            orders,
            message: 'Orders fetched successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const reviewOrder = async (req, res) => {
    // NOTE : req.user is set by the auth middleware we should have a user logged in
    const { id: userId } = req.user;

    const { id } = req.params;

    const { comment, rating } = req.body;

    try {

        const order = await Order.findById(id);

        // DONE : check if the order is delivered

        if (order.status === ORDER_STATUS.DELIVERED) {
            return res.status(400).json({
                message: 'Order is not delivered yet',
            });
        }
        // DONE : check if the order is not reviewed before
        const orderReviewed = await Review.find({
            order: id,
            user: userId
        });

        if (orderReviewed) {
            return res.status(400).json({
                message: 'Order is already reviewed',
            });
        }
        // TODO : check if the order is not reviewed by the restaurant owner
        const restaurant = await Restaurant.findById(order.restaurant);

        if (restaurant.owner === userId) {
            return res.status(400).json({
                message: 'Orders can not be reviewed by restaurant owner',
            });
        }

        // create review
        const review = new Review({
            restaurant: order.restaurant,
            user: userId,
            order: id,
            comment,
            rating
        });

        await review.save();

        return res.status(201).json({
            review,
            message: 'Review created successfully'
        });


    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }

};


module.exports = {
    createOrder,
    getRestaurantOrders,
    cancelOrder,
    reviewOrder
}; 