const { Router } = require('express');
const router = new Router();

const {
    createOrder,
    getRestaurantOrders,
    cancelOrder,
    reviewOrder
} = require('../controllers/order.controller')


// TODO : implement all enpoints for getAll orders, get order by id,..etc
router.post('/', createOrder);
router.get('/restaurant/:id', getRestaurantOrders);
router.put('/:id/cancel', cancelOrder);
router.post('/:id/review', reviewOrder);
module.exports = router;
