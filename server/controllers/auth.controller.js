'use strict';

const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * Đăng ký tài khoản mới
 * POST /api/auth/register
 */
const register = catchAsync(async (req, res, next) => {
  const { email, password, fullName, phone, username } = req.body;

  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('Email already exists');
  }

  // Kiểm tra username nếu được cung cấp
  if (username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw ApiError.conflict('Username already exists');
    }
  }

  // Tạo user mới
  const user = await User.create({
    email,
    password,
    fullName,
    phone,
    username
  });

  // Tạo tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Lưu refresh token vào database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Cập nhật lastLogin
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Gửi token qua cookie (tùy chọn)
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Trả về response (không bao gồm password)
  const userData = user.toJSON();

  res.status(201).json(
    ApiResponse.created(
      {
        user: userData,
        tokens: {
          accessToken,
          refreshToken
        }
      },
      'Registration successful'
    )
  );
});

/**
 * Đăng nhập
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Tìm user và lấy password (vì password có select: false)
  const user = await User.findOne({ email }).select('+password');

  // Kiểm tra user có tồn tại không
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Kiểm tra tài khoản có bị xóa không
  if (user.isDeleted) {
    throw ApiError.unauthorized('Account has been deleted');
  }

  // Kiểm tra password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Tạo tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Lưu refresh token vào database
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Gửi token qua cookie (tùy chọn)
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Trả về response (không bao gồm password)
  const userData = user.toJSON();

  res.status(200).json(
    ApiResponse.success(
      {
        user: userData,
        tokens: {
          accessToken,
          refreshToken
        }
      },
      'Login successful'
    )
  );
});

/**
 * Đăng xuất
 * POST /api/auth/logout
 */
const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Xóa refresh token từ database
    const user = await User.findOne({ refreshToken }).select('+refreshToken');
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
  }

  // Xóa cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json(
    ApiResponse.success(null, 'Logout successful')
  );
});

/**
 * Lấy thông tin user hiện tại
 * GET /api/auth/me
 */
const getMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json(
    ApiResponse.success(
      { user },
      'User information retrieved successfully'
    )
  );
});

module.exports = {
  register,
  login,
  logout,
  getMe
};


