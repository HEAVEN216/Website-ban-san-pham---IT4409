'use strict';

const express = require('express');
const router = express.Router();

// Import với error handling
let adminController;
let validate;
let protect;
let isAdmin;

try {
  adminController = require('../controllers/admin.controller');
  console.log('✓ Admin controller loaded');
} catch (error) {
  console.error('✗ Error loading admin controller:', error);
  throw error;
}

try {
  validate = require('../middlewares/validate.middleware');
  const authMiddleware = require('../middlewares/auth.middleware');
  const roleMiddleware = require('../middlewares/role.middleware');
  protect = authMiddleware.protect;
  isAdmin = roleMiddleware.isAdmin;
  console.log('✓ Admin middlewares loaded');
} catch (error) {
  console.error('✗ Error loading middlewares:', error);
  throw error;
}

/**
 * @route   GET /api/admin/stats
 * @desc    Lấy thống kê tổng quan (admin only)
 * @access  Private/Admin
 */
router.get(
  '/stats',
  protect,
  isAdmin,
  adminController.getStats
);

module.exports = router;

