'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const connectDB = require('../config/db');
const { User, Category, Product, Coupon } = require('../models');

const seedUsers = async () => {
  const users = [
    {
      email: 'admin@it4409.com',
      password: 'admin123',
      fullName: 'Admin User',
      phone: '0123456789',
      role: 'admin',
      isEmailVerified: true
    },
    {
      email: 'customer@it4409.com',
      password: 'customer123',
      fullName: 'Customer User',
      phone: '0987654321',
      role: 'customer',
      isEmailVerified: true
    }
  ];

  await User.insertMany(users);
  console.log('✓ Users seeded');
};

const seedCategories = async () => {
  const categories = [
    { name: 'Laptop', description: 'Máy tính xách tay' },
    { name: 'Smartphone', description: 'Điện thoại thông minh' },
    { name: 'Tablet', description: 'Máy tính bảng' },
    { name: 'Phụ kiện', description: 'Phụ kiện công nghệ' }
  ];

  const createdCategories = await Category.insertMany(categories);
  console.log('✓ Categories seeded');
  return createdCategories;
};

const seedProducts = async (categories) => {
  const laptopCategory = categories.find(c => c.name === 'Laptop');
  const phoneCategory = categories.find(c => c.name === 'Smartphone');

  const products = [
    {
      name: 'MacBook Pro 14 M3',
      description: 'MacBook Pro 14 inch với chip M3, RAM 16GB, SSD 512GB',
      price: 45990000,
      discount: 5,
      stock: 10,
      category: laptopCategory._id,
      brand: 'Apple',
      images: ['https://via.placeholder.com/500'],
      specifications: {
        'CPU': 'Apple M3',
        'RAM': '16GB',
        'Storage': '512GB SSD',
        'Display': '14.2 inch Liquid Retina XDR'
      }
    },
    {
      name: 'Dell XPS 13',
      description: 'Dell XPS 13 với Intel Core i7, RAM 16GB, SSD 512GB',
      price: 32990000,
      discount: 10,
      stock: 15,
      category: laptopCategory._id,
      brand: 'Dell',
      images: ['https://via.placeholder.com/500'],
      specifications: {
        'CPU': 'Intel Core i7-1355U',
        'RAM': '16GB',
        'Storage': '512GB SSD',
        'Display': '13.4 inch FHD+'
      }
    },
    {
      name: 'iPhone 15 Pro Max',
      description: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
      price: 34990000,
      discount: 3,
      stock: 20,
      category: phoneCategory._id,
      brand: 'Apple',
      images: ['https://via.placeholder.com/500'],
      specifications: {
        'Chip': 'A17 Pro',
        'RAM': '8GB',
        'Storage': '256GB',
        'Display': '6.7 inch Super Retina XDR'
      }
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Samsung Galaxy S24 Ultra 12GB/256GB',
      price: 29990000,
      discount: 8,
      stock: 25,
      category: phoneCategory._id,
      brand: 'Samsung',
      images: ['https://via.placeholder.com/500'],
      specifications: {
        'Chip': 'Snapdragon 8 Gen 3',
        'RAM': '12GB',
        'Storage': '256GB',
        'Display': '6.8 inch Dynamic AMOLED 2X'
      }
    }
  ];

  const productsWithSlug = products.map(p => ({
    ...p,
    slug: slugify(p.name, { lower: true, strict: true })
  }));

  await Product.insertMany(productsWithSlug);
  console.log('✓ Products seeded');
};

const seedCoupons = async () => {
  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const startDate = new Date(now.getTime() - oneDayMs); // started yesterday
  const endDate = new Date(now.getTime() + 30 * oneDayMs); // valid for 30 days

  const coupons = [
    {
      code: 'SALE10',
      name: 'Giảm 10% tối đa 100K',
      description: 'Mã giảm giá 10% cho toàn bộ đơn hàng, tối đa 100.000đ',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrderAmount: 0,
      maximumDiscountAmount: 100000,
      startDate,
      endDate,
      usageLimit: null,
      usageLimitPerUser: 5,
      applicableTo: 'all',
      categories: [],
      products: [],
      applicableToUsers: 'all',
      specificUsers: [],
      isActive: true
    },
    {
      code: 'FREESHIP',
      name: 'Miễn phí vận chuyển',
      description: 'Mã miễn phí vận chuyển cho đơn hàng từ 500.000đ',
      discountType: 'fixed',
      discountValue: 0,
      minimumOrderAmount: 500000,
      maximumDiscountAmount: null,
      startDate,
      endDate,
      usageLimit: null,
      usageLimitPerUser: 5,
      applicableTo: 'all',
      categories: [],
      products: [],
      applicableToUsers: 'all',
      specificUsers: [],
      isActive: true
    }
  ];

  await Coupon.insertMany(coupons);
  console.log('✓ Coupons seeded');
};

const seedAll = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    
    console.log('Seeding data...');
    await seedUsers();
    const categories = await seedCategories();
    await seedProducts(categories);
    await seedCoupons();
    
    console.log('✓ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

const clearAll = async () => {
  try {
    await connectDB();
    
    console.log('Clearing all data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    
    console.log('✓ Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Clear error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '--clear') {
  clearAll();
} else {
  seedAll();
}
