'use strict';

const express = require('express');
const router = express.Router();

let orderController;
let orderValidator;
let validate;
let protect;

try {
  orderController = require('../controllers/order.controller');
  console.log('✓ Order controller loaded');
} catch (error) {
  console.error('✗ Error loading order controller:', error);
  throw error;
}

try {
  orderValidator = require('../validators/order.validator');
  console.log('✓ Order validators loaded');
} catch (error) {
  console.error('✗ Error loading order validators:', error);
  throw error;
}

try {
  validate = require('../middlewares/validate.middleware');
  const authMiddleware = require('../middlewares/auth.middleware');
  protect = authMiddleware.protect;
  console.log('✓ Order middlewares loaded');
} catch (error) {
  console.error('✗ Error loading order middlewares:', error);
  throw error;
}

/**
 * @route   GET /api/orders
 * @desc    Lấy danh sách đơn hàng của user hiện tại
 * @access  Private
 */
router.get(
  '/',
  protect,
  orderValidator.getMyOrdersValidator,
  validate,
  orderController.getMyOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Lấy chi tiết đơn hàng của user hiện tại
 * @access  Private
 */
router.get(
  '/:id',
  protect,
  orderValidator.getOrderByIdValidator,
  validate,
  orderController.getOrderById
);

module.exports = router;


