'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { createOrder, cancelOrder } = require('../controllers/orders.controller');

router.post('/', protect, createOrder);
router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;
