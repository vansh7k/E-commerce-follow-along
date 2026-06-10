const express = require('express');
const { updateCart, increaseQuantity, decreaseQuantity, getCart } = require('../controller/cart.controller');

const router = express.Router();

router.get('/cart/:userId', getCart); // Route to get cart for a user
router.post('/cart/increase', increaseQuantity); // Route to increase quantity
router.post('/cart/decrease', decreaseQuantity); // Route to decrease quantity

module.exports = router;
