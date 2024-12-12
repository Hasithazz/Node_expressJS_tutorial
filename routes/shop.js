const path = require('path');

const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getproducts);

router.get('/products/:productId', shopController.getproduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart)

router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.getOrders);

module.exports = router;
