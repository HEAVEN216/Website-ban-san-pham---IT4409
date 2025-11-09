'use strict';

const express = require('express');
const router = express.Router();

// Import với error handling
let register, login, logout, getMe;
let registerValidator, loginValidator;
let validate;
let protect;

try {
  const authController = require('../controllers/auth.controller');
  register = authController.register;
  login = authController.login;
  logout = authController.logout;
  getMe = authController.getMe;
  console.log('✓ Auth controller loaded');
} catch (error) {
  console.error('✗ Error loading auth controller:', error);
  throw error;
}

try {
  const authValidator = require('../validators/auth.validator');
  registerValidator = authValidator.registerValidator;
  loginValidator = authValidator.loginValidator;
  console.log('✓ Auth validators loaded');
} catch (error) {
  console.error('✗ Error loading auth validators:', error);
  throw error;
}

try {
  validate = require('../middlewares/validate.middleware');
  const authMiddleware = require('../middlewares/auth.middleware');
  protect = authMiddleware.protect;
  console.log('✓ Auth middlewares loaded');
} catch (error) {
  console.error('✗ Error loading middlewares:', error);
  throw error;
}

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 * @access  Public
 */
router.post('/register', registerValidator, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
router.post('/login', loginValidator, validate, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private
 */
router.get('/me', protect, getMe);

module.exports = router;


