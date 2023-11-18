const { Router } = require('express');

const {
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
} = require('../controllers/restaurant.controller');

const router = new Router();

router.post('/', createRestaurant);
router.get('/', getAllRestaurants);
router.get('/nearby', getNearbyRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);
router.post('/:id/menu', addNewMenu);
router.post('/:id/menus', addNewMenus);
router.get('/:id/reviews', getReviews);
router.get('/:id/reviews/filter', getFilteredReviews);





module.exports = router;
