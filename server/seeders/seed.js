'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const connectDB = require('../config/db');
const { User, Category, Product, Coupon, Review, Cart, Order, OrderItem, Payment } = require('../models');

// ==================== SEED USERS ====================
const seedUsers = async () => {
  const users = [
    // Admins
    {
      email: 'admin@it4409.com',
      password: 'admin123',
      fullName: 'Nguyễn Văn Admin',
      username: 'admin',
      phone: '0123456789',
      role: 'admin',
      isEmailVerified: true,
      addresses: [{
        fullName: 'Nguyễn Văn Admin',
        phone: '0123456789',
        street: '144 Xuân Thủy',
        ward: 'Dịch Vọng Hậu',
        district: 'Cầu Giấy',
        city: 'Hà Nội',
        isDefault: true
      }]
    },
    {
      email: 'admin2@it4409.com',
      password: 'admin123',
      fullName: 'Trần Thị Quản Trị',
      username: 'admin2',
      phone: '0123456788',
      role: 'admin',
      isEmailVerified: true
    },
    // Staff
    {
      email: 'staff@it4409.com',
      password: 'staff123',
      fullName: 'Lê Văn Nhân Viên',
      username: 'staff',
      phone: '0123456787',
      role: 'staff',
      isEmailVerified: true
    },
    // Customers
    {
      email: 'customer1@it4409.com',
      password: 'customer123',
      fullName: 'Phạm Minh Tuấn',
      username: 'minhtuan',
      phone: '0987654321',
      role: 'customer',
      isEmailVerified: true,
      addresses: [{
        fullName: 'Phạm Minh Tuấn',
        phone: '0987654321',
        street: '268 Tô Hiệu',
        ward: 'Hà Cầu',
        district: 'Hà Đông',
        city: 'Hà Nội',
        isDefault: true
      }]
    },
    {
      email: 'customer2@it4409.com',
      password: 'customer123',
      fullName: 'Hoàng Thị Lan',
      username: 'thilan',
      phone: '0987654322',
      role: 'customer',
      isEmailVerified: true,
      addresses: [{
        fullName: 'Hoàng Thị Lan',
        phone: '0987654322',
        street: '91 Chùa Láng',
        ward: 'Láng Thượng',
        district: 'Đống Đa',
        city: 'Hà Nội',
        isDefault: true
      }]
    },
    {
      email: 'customer3@it4409.com',
      password: 'customer123',
      fullName: 'Vũ Quang Huy',
      username: 'quanghuy',
      phone: '0987654323',
      role: 'customer',
      isEmailVerified: true
    },
    {
      email: 'customer4@it4409.com',
      password: 'customer123',
      fullName: 'Đỗ Thu Hương',
      username: 'thuhuong',
      phone: '0987654324',
      role: 'customer',
      isEmailVerified: false
    },
    {
      email: 'customer5@it4409.com',
      password: 'customer123',
      fullName: 'Bùi Văn Nam',
      username: 'vannam',
      phone: '0987654325',
      role: 'customer',
      isEmailVerified: true
    }
  ];

  // Use .save() instead of insertMany to trigger pre-save hook for password hashing
  const createdUsers = [];
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    createdUsers.push(user);
  }
  console.log(`✓ ${createdUsers.length} Users seeded`);
  return createdUsers;
};

// ==================== SEED CATEGORIES ====================
const seedCategories = async () => {
  const categories = [
    // Level 1 - Main categories
    { name: 'Laptop', description: 'Máy tính xách tay', level: 1 },
    { name: 'Điện thoại', description: 'Điện thoại thông minh', level: 1 },
    { name: 'Tablet', description: 'Máy tính bảng', level: 1 },
    { name: 'Đồng hồ thông minh', description: 'Smartwatch & Wearables', level: 1 },
    { name: 'Tai nghe', description: 'Tai nghe & Loa', level: 1 },
    { name: 'PC & Màn hình', description: 'Máy tính để bàn và màn hình', level: 1 },
    { name: 'Gaming', description: 'Thiết bị chơi game', level: 1 },
    { name: 'Phụ kiện', description: 'Phụ kiện công nghệ', level: 1 }
  ];

  const categoriesWithSlug = categories.map(c => ({
    ...c,
    slug: slugify(c.name, { lower: true, strict: true, locale: 'vi' })
  }));

  const createdCategories = await Category.insertMany(categoriesWithSlug);
  console.log(`✓ ${createdCategories.length} Categories seeded`);
  return createdCategories;
};

// ==================== SEED PRODUCTS ====================
const seedProducts = async (categories) => {
  const laptopCat = categories.find(c => c.name === 'Laptop');
  const phoneCat = categories.find(c => c.name === 'Điện thoại');
  const tabletCat = categories.find(c => c.name === 'Tablet');
  const watchCat = categories.find(c => c.name === 'Đồng hồ thông minh');
  const audioCat = categories.find(c => c.name === 'Tai nghe');
  const gamingCat = categories.find(c => c.name === 'Gaming');
  const accessoryCat = categories.find(c => c.name === 'Phụ kiện');

  const products = [
    // === LAPTOPS ===
    {
      name: 'MacBook Pro 14 M3',
      description: 'MacBook Pro 14 inch với chip M3, hiệu năng vượt trội cho công việc chuyên nghiệp',
      price: 45990000,
      discount: 5,
      stock: 15,
      category: laptopCat._id,
      brand: 'Apple',
      images: [
        'https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-pro-14-m3-2023-mrx33saa-thumb-600x600.jpg',
        'https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-pro-14-m3-2023-1-1-750x500.jpg'
      ],
      specifications: {
        'CPU': 'Apple M3 8-core',
        'RAM': '16GB Unified Memory',
        'Storage': '512GB SSD',
        'Display': '14.2 inch Liquid Retina XDR',
        'Graphics': 'Integrated 10-core GPU',
        'Weight': '1.55 kg'
      },
      isActive: true
    },
    {
      name: 'MacBook Air 13 M2',
      description: 'MacBook Air 13 inch, siêu mỏng nhẹ, pin trâu, phù hợp cho sinh viên và văn phòng',
      price: 27990000,
      discount: 8,
      stock: 25,
      category: laptopCat._id,
      brand: 'Apple',
      images: ['https://cdn.tgdd.vn/Products/Images/44/289441/apple-macbook-air-13-m2-2022-8-750x500.jpg'],
      specifications: {
        'CPU': 'Apple M2 8-core',
        'RAM': '8GB',
        'Storage': '256GB SSD',
        'Display': '13.6 inch Liquid Retina',
        'Weight': '1.24 kg'
      },
      isActive: true
    },
    {
      name: 'Dell XPS 13 Plus',
      description: 'Dell XPS 13 Plus thiết kế premium, hiệu năng mạnh mẽ với Intel Core i7 thế hệ 13',
      price: 32990000,
      discount: 10,
      stock: 12,
      category: laptopCat._id,
      brand: 'Dell',
      images: ['https://cdn.tgdd.vn/Products/Images/44/287066/dell-xps-13-plus-9320-i7-u-thumb-600x600.jpg'],
      specifications: {
        'CPU': 'Intel Core i7-1360P',
        'RAM': '16GB LPDDR5',
        'Storage': '512GB SSD',
        'Display': '13.4 inch FHD+',
        'Weight': '1.26 kg'
      },
      isActive: true
    },
    {
      name: 'Asus ROG Strix G16',
      description: 'Laptop gaming Asus ROG với RTX 4060, màn hình 165Hz, chiến mọi tựa game',
      price: 36990000,
      discount: 12,
      stock: 8,
      category: laptopCat._id,
      brand: 'Asus',
      images: ['https://cdn.tgdd.vn/Products/Images/44/316771/asus-rog-strix-g16-g614ju-i7-n4085w-thumb-600x600.jpg'],
      specifications: {
        'CPU': 'Intel Core i7-13650HX',
        'RAM': '16GB DDR5',
        'Storage': '512GB SSD',
        'Display': '16 inch FHD 165Hz',
        'Graphics': 'NVIDIA RTX 4060 8GB'
      },
      isActive: true
    },
    {
      name: 'HP Pavilion 15',
      description: 'Laptop HP Pavilion 15 giá tốt, phù hợp học sinh sinh viên',
      price: 15490000,
      discount: 5,
      stock: 30,
      category: laptopCat._id,
      brand: 'HP',
      images: ['https://cdn.tgdd.vn/Products/Images/44/316854/hp-pavilion-15-eg3115tu-i5-8u-thumb-600x600.jpg'],
      specifications: {
        'CPU': 'Intel Core i5-1335U',
        'RAM': '8GB DDR4',
        'Storage': '512GB SSD',
        'Display': '15.6 inch FHD'
      },
      isActive: true
    },

    // === SMARTPHONES ===
    {
      name: 'iPhone 15 Pro Max',
      description: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên, chip A17 Pro, camera 48MP',
      price: 34990000,
      discount: 3,
      stock: 20,
      category: phoneCat._id,
      brand: 'Apple',
      images: [
        'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-gold-thumbnew-600x600.jpg',
        'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-1-1.jpg'
      ],
      specifications: {
        'Chip': 'Apple A17 Pro',
        'RAM': '8GB',
        'Storage': '256GB',
        'Display': '6.7 inch Super Retina XDR',
        'Camera': 'Main 48MP, Ultra Wide 12MP, Telephoto 12MP',
        'Battery': '4422 mAh'
      },
      isActive: true
    },
    {
      name: 'iPhone 15',
      description: 'iPhone 15 128GB - Màu hồng, Dynamic Island, camera 48MP',
      price: 22990000,
      discount: 5,
      stock: 35,
      category: phoneCat._id,
      brand: 'Apple',
      images: ['https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pink-thumbnew-600x600.jpg'],
      specifications: {
        'Chip': 'Apple A16 Bionic',
        'RAM': '6GB',
        'Storage': '128GB',
        'Display': '6.1 inch Super Retina XDR',
        'Camera': 'Main 48MP, Ultra Wide 12MP'
      },
      isActive: true
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Samsung Galaxy S24 Ultra 12GB/256GB - Flagship Android với bút S Pen',
      price: 29990000,
      discount: 8,
      stock: 18,
      category: phoneCat._id,
      brand: 'Samsung',
      images: ['https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg'],
      specifications: {
        'Chip': 'Snapdragon 8 Gen 3 for Galaxy',
        'RAM': '12GB',
        'Storage': '256GB',
        'Display': '6.8 inch Dynamic AMOLED 2X, 120Hz',
        'Camera': 'Main 200MP, Ultra Wide 12MP, Telephoto 50MP + 10MP'
      },
      isActive: true
    },
    {
      name: 'Samsung Galaxy A55',
      description: 'Samsung Galaxy A55 5G 8GB/256GB - Trung cấp giá tốt',
      price: 11490000,
      discount: 10,
      stock: 40,
      category: phoneCat._id,
      brand: 'Samsung',
      images: ['https://cdn.tgdd.vn/Products/Images/42/322096/samsung-galaxy-a55-5g-xanh-thumb-1-600x600.jpg'],
      specifications: {
        'Chip': 'Exynos 1480',
        'RAM': '8GB',
        'Storage': '256GB',
        'Display': '6.6 inch Super AMOLED',
        'Camera': 'Main 50MP'
      },
      isActive: true
    },
    {
      name: 'Xiaomi 14',
      description: 'Xiaomi 14 12GB/256GB - Camera Leica, sạc nhanh 90W',
      price: 19990000,
      discount: 7,
      stock: 15,
      category: phoneCat._id,
      brand: 'Xiaomi',
      images: ['https://cdn.tgdd.vn/Products/Images/42/313176/xiaomi-14-black-thumbnew-600x600.jpg'],
      specifications: {
        'Chip': 'Snapdragon 8 Gen 3',
        'RAM': '12GB',
        'Storage': '256GB',
        'Display': '6.36 inch AMOLED 120Hz',
        'Camera': 'Leica 50MP'
      },
      isActive: true
    },
    {
      name: 'OPPO Reno11',
      description: 'OPPO Reno11 5G - Thiết kế đẹp, camera chân dung ấn tượng',
      price: 10490000,
      discount: 12,
      stock: 25,
      category: phoneCat._id,
      brand: 'OPPO',
      images: ['https://cdn.tgdd.vn/Products/Images/42/320131/oppo-reno11-5g-xanh-thumb-600x600.jpg'],
      specifications: {
        'Chip': 'MediaTek Dimensity 7050',
        'RAM': '8GB',
        'Storage': '256GB',
        'Display': '6.7 inch AMOLED',
        'Camera': 'Main 50MP'
      },
      isActive: true
    },

    // === TABLETS ===
    {
      name: 'iPad Pro M2 11 inch',
      description: 'iPad Pro 11 inch M2 WiFi 128GB - Màn hình Liquid Retina, chip M2 mạnh mẽ',
      price: 22990000,
      discount: 5,
      stock: 12,
      category: tabletCat._id,
      brand: 'Apple',
      images: ['https://cdn.tgdd.vn/Products/Images/522/289699/ipad-pro-m2-11-wifi-gray-thumb-600x600.jpg'],
      specifications: {
        'Chip': 'Apple M2',
        'RAM': '8GB',
        'Storage': '128GB',
        'Display': '11 inch Liquid Retina',
        'OS': 'iPadOS 17'
      },
      isActive: true
    },
    {
      name: 'iPad Air 5 M1',
      description: 'iPad Air 5 M1 WiFi 64GB - Cân bằng giữa giá và hiệu năng',
      price: 16990000,
      discount: 8,
      stock: 18,
      category: tabletCat._id,
      brand: 'Apple',
      images: ['https://cdn.tgdd.vn/Products/Images/522/274552/ipad-air-5-m1-wifi-pink-thumb-600x600.jpg'],
      specifications: {
        'Chip': 'Apple M1',
        'Storage': '64GB',
        'Display': '10.9 inch Liquid Retina'
      },
      isActive: true
    },
    {
      name: 'Samsung Galaxy Tab S9',
      description: 'Samsung Galaxy Tab S9 11 inch - Tablet Android cao cấp, kèm S Pen',
      price: 19990000,
      discount: 10,
      stock: 10,
      category: tabletCat._id,
      brand: 'Samsung',
      images: ['https://cdn.tgdd.vn/Products/Images/522/309816/samsung-galaxy-tab-s9-11-inch-gray-thumb-600x600.jpg'],
      specifications: {
        'Chip': 'Snapdragon 8 Gen 2',
        'RAM': '8GB',
        'Storage': '128GB',
        'Display': '11 inch Dynamic AMOLED 2X 120Hz'
      },
      isActive: true
    },
    {
      name: 'Xiaomi Pad 6',
      description: 'Xiaomi Pad 6 - Tablet giá rẻ, màn hình 144Hz mượt mà',
      price: 8990000,
      discount: 15,
      stock: 20,
      category: tabletCat._id,
      brand: 'Xiaomi',
      images: ['https://cdn.tgdd.vn/Products/Images/522/306207/xiaomi-pad-6-gold-thumb-600x600.jpg'],
      specifications: {
        'Chip': 'Snapdragon 870',
        'RAM': '8GB',
        'Storage': '256GB',
        'Display': '11 inch LCD 144Hz'
      },
      isActive: true
    },

    // === SMARTWATCHES ===
    {
      name: 'Apple Watch Series 9 GPS',
      description: 'Apple Watch Series 9 41mm - Theo dõi sức khỏe toàn diện, chip S9 mạnh mẽ',
      price: 10990000,
      discount: 5,
      stock: 25,
      category: watchCat._id,
      brand: 'Apple',
      images: ['https://cdn.tgdd.vn/Products/Images/7077/309144/apple-watch-s9-gps-41mm-vien-nhom-day-cao-su-thumb-600x600.jpg'],
      specifications: {
        'Chip': 'Apple S9',
        'Display': '1.69 inch OLED',
        'Sensors': 'Heart rate, Blood oxygen, ECG',
        'Battery': 'Up to 18 hours'
      },
      isActive: true
    },
    {
      name: 'Samsung Galaxy Watch 6',
      description: 'Samsung Galaxy Watch 6 40mm - Smartwatch Android với nhiều tính năng sức khỏe',
      price: 6990000,
      discount: 10,
      stock: 20,
      category: watchCat._id,
      brand: 'Samsung',
      images: ['https://cdn.tgdd.vn/Products/Images/7077/306994/samsung-galaxy-watch6-40mm-thumb-gold-600x600.jpg'],
      specifications: {
        'Chip': 'Exynos W930',
        'Display': '1.3 inch Super AMOLED',
        'Battery': '300 mAh'
      },
      isActive: true
    },
    {
      name: 'Xiaomi Watch 2 Pro',
      description: 'Xiaomi Watch 2 Pro - Smartwatch Wear OS, pin khỏe',
      price: 5990000,
      discount: 8,
      stock: 15,
      category: watchCat._id,
      brand: 'Xiaomi',
      images: ['https://cdn.tgdd.vn/Products/Images/7077/318873/xiaomi-watch-2-pro-1-600x600.jpg'],
      specifications: {
        'Chip': 'Snapdragon W5+ Gen 1',
        'Display': '1.43 inch AMOLED',
        'OS': 'Wear OS by Google'
      },
      isActive: true
    },

    // === AUDIO (TAI NGHE) ===
    {
      name: 'AirPods Pro 2',
      description: 'AirPods Pro 2 USB-C - Tai nghe True Wireless, chống ồn chủ động tốt nhất',
      price: 5990000,
      discount: 8,
      stock: 30,
      category: audioCat._id,
      brand: 'Apple',
      images: ['https://cdn.tgdd.vn/Products/Images/54/325533/airpods-pro-2-usbc-thumb-600x600.jpg'],
      specifications: {
        'Type': 'True Wireless',
        'ANC': 'Active Noise Cancellation',
        'Battery': 'Up to 6 hours (ANC on)',
        'Charging': 'USB-C, Wireless'
      },
      isActive: true
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Sony WH-1000XM5 - Tai nghe chụp tai, chống ồn đỉnh cao',
      price: 8490000,
      discount: 10,
      stock: 15,
      category: audioCat._id,
      brand: 'Sony',
      images: ['https://cdn.tgdd.vn/Products/Images/54/289758/sony-wh-1000xm5-den-thumb-1-600x600.jpg'],
      specifications: {
        'Type': 'Over-ear',
        'ANC': 'Industry-leading ANC',
        'Battery': 'Up to 30 hours'
      },
      isActive: true
    },
    {
      name: 'Samsung Buds2 Pro',
      description: 'Samsung Galaxy Buds2 Pro - True Wireless cao cấp cho Galaxy',
      price: 3990000,
      discount: 15,
      stock: 25,
      category: audioCat._id,
      brand: 'Samsung',
      images: ['https://cdn.tgdd.vn/Products/Images/54/286493/tai-nghe-bluetooth-true-wireless-samsung-buds2-pro-thumb-600x600.jpg'],
      specifications: {
        'Type': 'True Wireless',
        'ANC': 'Yes',
        'Battery': 'Up to 5 hours'
      },
      isActive: true
    },
    {
      name: 'JBL Tune 770NC',
      description: 'JBL Tune 770NC - Tai nghe chụp tai giá rẻ, pin trâu',
      price: 1990000,
      discount: 10,
      stock: 35,
      category: audioCat._id,
      brand: 'JBL',
      images: ['https://cdn.tgdd.vn/Products/Images/54/312248/jbl-tune-770nc-den-thumb-1-600x600.jpg'],
      specifications: {
        'Type': 'Over-ear',
        'ANC': 'Yes',
        'Battery': 'Up to 70 hours'
      },
      isActive: true
    },

    // === GAMING ===
    {
      name: 'PlayStation 5 Slim',
      description: 'PS5 Slim Digital Edition - Máy chơi game thế hệ mới từ Sony',
      price: 13990000,
      discount: 5,
      stock: 10,
      category: gamingCat._id,
      brand: 'Sony',
      images: ['https://cdn.tgdd.vn/Products/Images/5697/318974/ps5-slim-digital-thumb-600x600.jpg'],
      specifications: {
        'Storage': '1TB SSD',
        'Resolution': 'Up to 8K',
        'Controller': 'DualSense'
      },
      isActive: true
    },
    {
      name: 'Nintendo Switch OLED',
      description: 'Nintendo Switch OLED - Máy chơi game cầm tay, màn hình OLED 7 inch',
      price: 9490000,
      discount: 3,
      stock: 15,
      category: gamingCat._id,
      brand: 'Nintendo',
      images: ['https://cdn.tgdd.vn/Products/Images/5697/281201/nintendo-switch-oled-thumb-1-1-600x600.jpg'],
      specifications: {
        'Display': '7 inch OLED',
        'Storage': '64GB',
        'Mode': 'Handheld, Tabletop, Docked'
      },
      isActive: true
    },
    {
      name: 'Logitech G Pro X Superlight',
      description: 'Chuột gaming Logitech G Pro X Superlight - Wireless, siêu nhẹ 63g',
      price: 3490000,
      discount: 8,
      stock: 20,
      category: gamingCat._id,
      brand: 'Logitech',
      images: ['https://cdn.tgdd.vn/Products/Images/86/236032/logitech-g-pro-x-superlight-black-thumb-600x600.jpg'],
      specifications: {
        'Type': 'Wireless Gaming Mouse',
        'Weight': '63g',
        'DPI': 'Up to 25,600',
        'Battery': 'Up to 70 hours'
      },
      isActive: true
    },

    // === ACCESSORIES ===
    {
      name: 'Anker PowerCore 20000mAh',
      description: 'Pin dự phòng Anker 20000mAh, sạc nhanh PD 20W',
      price: 890000,
      discount: 10,
      stock: 50,
      category: accessoryCat._id,
      brand: 'Anker',
      images: ['https://cdn.tgdd.vn/Products/Images/57/228021/anker-powercore-20000mah-pd-thumb-600x600.jpg'],
      specifications: {
        'Capacity': '20000mAh',
        'Output': 'USB-C PD 20W, USB-A 18W'
      },
      isActive: true
    },
    {
      name: 'Ugreen GaN 65W',
      description: 'Sạc nhanh Ugreen GaN 65W 3 cổng - Nhỏ gọn, sạc được Laptop',
      price: 790000,
      discount: 15,
      stock: 40,
      category: accessoryCat._id,
      brand: 'Ugreen',
      images: ['https://cdn.tgdd.vn/Products/Images/58/325147/sac-ugreen-65w-3-cong-usbc-usba-thumb-600x600.jpg'],
      specifications: {
        'Power': '65W',
        'Ports': '2x USB-C, 1x USB-A',
        'Technology': 'GaN (Gallium Nitride)'
      },
      isActive: true
    },
    {
      name: 'Baseus 100W USB-C Cable',
      description: 'Cáp sạc Baseus USB-C to USB-C 100W, dài 2m',
      price: 290000,
      discount: 5,
      stock: 60,
      category: accessoryCat._id,
      brand: 'Baseus',
      images: ['https://cdn.tgdd.vn/Products/Images/58/325148/cap-type-c-baseus-100w-2m-thumb-600x600.jpg'],
      specifications: {
        'Type': 'USB-C to USB-C',
        'Power': '100W',
        'Length': '2m'
      },
      isActive: true
    }
  ];

  const productsWithSlug = products.map(p => ({
    ...p,
    slug: slugify(p.name, { lower: true, strict: true, locale: 'vi' })
  }));

  const createdProducts = await Product.insertMany(productsWithSlug);
  console.log(`✓ ${createdProducts.length} Products seeded`);
  return createdProducts;
};

// ==================== SEED COUPONS ====================
const seedCoupons = async () => {
  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const startDate = new Date(now.getTime() - 2 * oneDayMs);
  const endDate = new Date(now.getTime() + 30 * oneDayMs);

  const coupons = [
    {
      code: 'WELCOME10',
      name: 'Giảm 10% đơn đầu tiên',
      description: 'Mã giảm giá 10% cho khách hàng mới, tối đa 100.000đ',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrderAmount: 0,
      maximumDiscountAmount: 100000,
      startDate,
      endDate,
      usageLimit: null,
      usageLimitPerUser: 1,
      applicableTo: 'all',
      applicableToUsers: 'all',
      isActive: true
    },
    {
      code: 'SALE20',
      name: 'Giảm 20% tối đa 500K',
      description: 'Mã giảm giá 20% cho đơn hàng từ 2 triệu',
      discountType: 'percentage',
      discountValue: 20,
      minimumOrderAmount: 2000000,
      maximumDiscountAmount: 500000,
      startDate,
      endDate,
      usageLimit: 100,
      usageLimitPerUser: 3,
      applicableTo: 'all',
      applicableToUsers: 'all',
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
      applicableToUsers: 'all',
      isActive: true
    },
    {
      code: 'TECH500',
      name: 'Giảm 500K',
      description: 'Giảm cố định 500.000đ cho đơn hàng từ 10 triệu',
      discountType: 'fixed',
      discountValue: 500000,
      minimumOrderAmount: 10000000,
      maximumDiscountAmount: null,
      startDate,
      endDate,
      usageLimit: 50,
      usageLimitPerUser: 2,
      applicableTo: 'all',
      applicableToUsers: 'all',
      isActive: true
    },
    {
      code: 'OLDCOUPON',
      name: 'Mã hết hạn',
      description: 'Mã này đã hết hạn (để test)',
      discountType: 'percentage',
      discountValue: 50,
      minimumOrderAmount: 0,
      maximumDiscountAmount: 1000000,
      startDate: new Date(now.getTime() - 60 * oneDayMs),
      endDate: new Date(now.getTime() - 30 * oneDayMs),
      usageLimit: null,
      usageLimitPerUser: 1,
      applicableTo: 'all',
      applicableToUsers: 'all',
      isActive: false
    }
  ];

  const createdCoupons = await Coupon.insertMany(coupons);
  console.log(`✓ ${createdCoupons.length} Coupons seeded`);
  return createdCoupons;
};

// ==================== SEED REVIEWS ====================
const seedReviews = async (users, products) => {
  const customers = users.filter(u => u.role === 'customer');
  
  // Lấy một số products để review
  const reviewableProducts = products.slice(0, 15);
  
  const reviews = [];
  
  reviewableProducts.forEach((product, idx) => {
    // Mỗi product có 2-4 reviews
    const numReviews = 2 + (idx % 3);
    
    for (let i = 0; i < numReviews && i < customers.length; i++) {
      reviews.push({
        user: customers[i]._id,
        product: product._id,
        rating: 3 + (idx + i) % 3, // Rating từ 3-5 sao
        comment: [
          'Sản phẩm rất tốt, đáng đồng tiền!',
          'Chất lượng ổn, giao hàng nhanh.',
          'Hài lòng với sản phẩm này.',
          'Sản phẩm đúng mô tả, shop nhiệt tình.',
          'Tuyệt vời, sẽ ủng hộ shop tiếp!',
          'Chất lượng tốt, giá cả hợp lý.',
          'Đóng gói cẩn thận, sản phẩm ngon.',
          'Sản phẩm xịn, ship nhanh.'
        ][(idx + i) % 8],
        isVerifiedPurchase: true
      });
    }
  });

  const createdReviews = await Review.insertMany(reviews);
  console.log(`✓ ${createdReviews.length} Reviews seeded`);
  return createdReviews;
};

// ==================== SEED CARTS ====================
const seedCarts = async (users, products) => {
  const customers = users.filter(u => u.role === 'customer');
  
  const carts = [];
  
  // Cart cho customer1 - 3 items
  carts.push({
    user: customers[0]._id,
    items: [
      {
        product: products[0]._id, // MacBook Pro 14 M3
        quantity: 1,
        priceAtAdd: products[0].price * (1 - products[0].discount / 100),
        addedAt: new Date()
      },
      {
        product: products[21]._id, // AirPods Pro 2 (index 21)
        quantity: 1,
        priceAtAdd: products[21].price * (1 - products[21].discount / 100),
        addedAt: new Date()
      },
      {
        product: products[25]._id, // Anker PowerCore (index 25)
        quantity: 2,
        priceAtAdd: products[25].price * (1 - products[25].discount / 100),
        addedAt: new Date()
      }
    ]
  });
  
  // Cart cho customer2 - 2 items
  carts.push({
    user: customers[1]._id,
    items: [
      {
        product: products[5]._id, // iPhone 15 Pro Max
        quantity: 1,
        priceAtAdd: products[5].price * (1 - products[5].discount / 100),
        addedAt: new Date()
      },
      {
        product: products[27]._id, // Baseus Cable (index 27)
        quantity: 1,
        priceAtAdd: products[27].price * (1 - products[27].discount / 100),
        addedAt: new Date()
      }
    ]
  });
  
  // Cart cho customer3 - 1 item
  carts.push({
    user: customers[2]._id,
    items: [
      {
        product: products[12]._id, // iPad Pro M2 (index 12)
        quantity: 1,
        priceAtAdd: products[12].price * (1 - products[12].discount / 100),
        addedAt: new Date()
      }
    ]
  });

  const createdCarts = await Cart.insertMany(carts);
  console.log(`✓ ${createdCarts.length} Carts seeded`);
  return createdCarts;
};

// ==================== SEED ORDERS ====================
const seedOrders = async (users, products) => {
  const customers = users.filter(u => u.role === 'customer');
  
  const orders = [];
  const orderItems = [];
  const payments = [];
  
  // === Order 1: Đã giao (completed) ===
  const order1 = {
    user: customers[0]._id,
    shippingAddress: {
      fullName: 'Phạm Minh Tuấn',
      phone: '0987654321',
      street: '268 Tô Hiệu',
      ward: 'Hà Cầu',
      district: 'Hà Đông',
      city: 'Hà Nội'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    subtotal: 23990000,
    shippingFee: 30000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 24020000,
    notes: 'Giao hàng giờ hành chính',
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  };
  
  // === Order 2: Đang xử lý (processing) ===
  const order2 = {
    user: customers[1]._id,
    shippingAddress: {
      fullName: 'Hoàng Thị Lan',
      phone: '0987654322',
      street: '91 Chùa Láng',
      ward: 'Láng Thượng',
      district: 'Đống Đa',
      city: 'Hà Nội'
    },
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    orderStatus: 'processing',
    subtotal: 45990000,
    shippingFee: 0,
    taxAmount: 0,
    discountAmount: 500000,
    totalAmount: 45490000,
    notes: '',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  };
  
  // === Order 3: Chờ xác nhận (pending) ===
  const order3 = {
    user: customers[2]._id,
    shippingAddress: {
      fullName: 'Vũ Quang Huy',
      phone: '0987654323',
      street: '54 Nguyễn Chí Thanh',
      ward: 'Láng Hạ',
      district: 'Đống Đa',
      city: 'Hà Nội'
    },
    paymentMethod: 'vnpay',
    paymentStatus: 'paid',
    orderStatus: 'pending',
    subtotal: 16990000,
    shippingFee: 30000,
    taxAmount: 0,
    discountAmount: 1699000,
    totalAmount: 15321000,
    notes: '',
    paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  };
  
  // === Order 4: Đã hủy (cancelled) ===
  const order4 = {
    user: customers[0]._id,
    shippingAddress: {
      fullName: 'Phạm Minh Tuấn',
      phone: '0987654321',
      street: '268 Tô Hiệu',
      ward: 'Hà Cầu',
      district: 'Hà Đông',
      city: 'Hà Nội'
    },
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    orderStatus: 'cancelled',
    subtotal: 8990000,
    shippingFee: 30000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 9020000,
    notes: '',
    cancellationReason: 'Khách hàng đổi ý',
    cancelledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  };
  
  // Tạo từng order một để pre-save hook chạy đúng
  const createdOrders = [];
  createdOrders.push(await Order.create(order1));
  createdOrders.push(await Order.create(order2));
  createdOrders.push(await Order.create(order3));
  createdOrders.push(await Order.create(order4));
  
  console.log(`✓ ${createdOrders.length} Orders seeded`);
  
  // === Create Order Items ===
  // Order 1 items
  orderItems.push({
    order: createdOrders[0]._id,
    product: products[1]._id, // MacBook Air M2 (index 1)
    productName: products[1].name,
    productImage: products[1].images[0],
    price: Math.round(products[1].price * (1 - products[1].discount / 100)),
    quantity: 1,
    subtotal: Math.round(products[1].price * (1 - products[1].discount / 100))
  });
  
  // Order 2 items
  orderItems.push({
    order: createdOrders[1]._id,
    product: products[0]._id, // MacBook Pro 14 M3 (index 0)
    productName: products[0].name,
    productImage: products[0].images[0],
    price: Math.round(products[0].price * (1 - products[0].discount / 100)),
    quantity: 1,
    subtotal: Math.round(products[0].price * (1 - products[0].discount / 100))
  });
  
  // Order 3 items
  orderItems.push({
    order: createdOrders[2]._id,
    product: products[13]._id, // iPad Air 5 (index 13)
    productName: products[13].name,
    productImage: products[13].images[0],
    price: Math.round(products[13].price * (1 - products[13].discount / 100)),
    quantity: 1,
    subtotal: Math.round(products[13].price * (1 - products[13].discount / 100))
  });
  
  // Order 4 items
  orderItems.push({
    order: createdOrders[3]._id,
    product: products[14]._id, // Xiaomi Pad 6 (index 14)
    productName: products[14].name,
    productImage: products[14].images[0],
    price: Math.round(products[14].price * (1 - products[14].discount / 100)),
    quantity: 1,
    subtotal: Math.round(products[14].price * (1 - products[14].discount / 100))
  });
  
  const createdOrderItems = await OrderItem.insertMany(orderItems);
  console.log(`✓ ${createdOrderItems.length} Order Items seeded`);
  
  // === Create Payments ===
  payments.push({
    order: createdOrders[0]._id,
    method: 'credit_card',
    amount: 24020000,
    status: 'completed',
    transactionCode: `TXN${Date.now()}001`,
    paidAt: createdOrders[0].paidAt
  });
  
  payments.push({
    order: createdOrders[2]._id,
    method: 'vnpay',
    amount: 15321000,
    status: 'completed',
    transactionCode: `TXN${Date.now()}002`,
    paidAt: createdOrders[2].paidAt
  });
  
  const createdPayments = await Payment.insertMany(payments);
  console.log(`✓ ${createdPayments.length} Payments seeded`);
  
  return { orders: createdOrders, orderItems: createdOrderItems, payments: createdPayments };
};

// ==================== MAIN SEEDER ====================
const seedAll = async () => {
  try {
    await connectDB();
    
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    await Payment.deleteMany({});
    console.log('✓ All collections cleared\n');
    
    console.log('🌱 Seeding data...\n');
    const users = await seedUsers();
    const categories = await seedCategories();
    const products = await seedProducts(categories);
    const coupons = await seedCoupons();
    const reviews = await seedReviews(users, products);
    const carts = await seedCarts(users, products);
    const orderData = await seedOrders(users, products);
    
    console.log('\n✅ Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Coupons: ${coupons.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - Carts: ${carts.length}`);
    console.log(`   - Orders: ${orderData.orders.length}`);
    console.log(`   - Order Items: ${orderData.orderItems.length}`);
    console.log(`   - Payments: ${orderData.payments.length}`);
    
    console.log(`\n🔐 Test Accounts:`);
    console.log(`   Admin:     admin@it4409.com / admin123`);
    console.log(`   Staff:     staff@it4409.com / staff123`);
    console.log(`   Customer:  customer1@it4409.com / customer123`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

const clearAll = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing all data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    await Payment.deleteMany({});
    
    console.log('✓ Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Clear error:', error);
    process.exit(1);
  }
};

// Run
if (process.argv[2] === '--clear') {
  clearAll();
} else {
  seedAll();
}

