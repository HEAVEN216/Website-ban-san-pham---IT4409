'use strict';

const express = require('express');
const router = express.Router();

let orderController;
let ordersController;
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
  ordersController = require('../controllers/orders.controller');
  console.log('✓ Orders (create/cancel) controller loaded');
} catch (error) {
  console.error('✗ Error loading orders controller:', error);
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
 * @route   POST /api/orders
 * @desc    Tạo đơn hàng mới từ giỏ hàng hiện tại
 * @access  Private
 */
router.post(
  '/',
  protect,
  ordersController.createOrder
);

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

/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Người dùng huỷ đơn của chính mình
 * @access  Private
 */
router.patch(
  '/:id/cancel',
  protect,
  ordersController.cancelOrder
);

module.exports = router;



