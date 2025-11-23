# IT4409 E-Commerce Server

Backend API cho website bán sản phẩm công nghệ sử dụng MERN stack.

## Tech Stack

- **Node.js** + **Express.js**: Server framework
- **MongoDB** + **Mongoose**: Database
- **JWT**: Authentication (Access + Refresh tokens)
- **Bcrypt**: Password hashing
- **Cloudinary**: Image storage
- **Express Validator**: Input validation

## Cấu trúc thư mục

```
server/
├── config/           # Database, Cloudinary, Multer config
├── controllers/      # Business logic
├── middlewares/      # Auth, role, error, validation
├── models/           # Mongoose schemas
│   └── plugins/      # Reusable schema plugins
├── routes/           # API routes
├── seeders/          # Database seeding scripts
├── utils/            # Helper functions
├── validators/       # Validation schemas
└── app.js            # Express app entry point
```

## Models

- **User**: Quản lý người dùng (customer, staff, admin)
- **Category**: Danh mục sản phẩm (hỗ trợ cây phân cấp)
- **Product**: Sản phẩm với images, specs, ratings
- **Cart**: Giỏ hàng (embedded items)
- **Order**: Đơn hàng với tracking
- **OrderItem**: Chi tiết đơn hàng (snapshot giá)
- **Payment**: Thanh toán (COD, VNPay, MoMo)
- **Review**: Đánh giá sản phẩm (1-5 sao)

## Cài đặt

### 1. Clone và cài dependencies

```bash
cd server
npm install
```

### 2. Cấu hình .env

Copy `.env.example` thành `.env` và điền thông tin:

```bash
cp .env.example .env
```

**Cần cấu hình:**
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key cho JWT (min 32 chars)
- `JWT_REFRESH_SECRET`: Secret key cho refresh token
- `CLOUDINARY_*`: Credentials từ [Cloudinary Console](https://cloudinary.com/console)

### 3. Seed database (optional)

```bash
npm run seed
```

Tạo data mẫu:
- 2 users (admin@it4409.com / customer@it4409.com, password: admin123 / customer123)
- 4 categories
- 4 products

Xóa toàn bộ data:
```bash
npm run seed:clear
```

### 4. Chạy server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Server chạy tại: `http://localhost:5000`

## API Endpoints (Dự kiến)

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Đăng xuất

### Users
- `GET /api/users/me` - Thông tin user hiện tại
- `PATCH /api/users/me` - Cập nhật profile
- `GET /api/users` - Danh sách users (admin)

### Categories
- `GET /api/categories` - Danh sách categories
- `GET /api/categories/tree` - Cây phân cấp
- `POST /api/categories` - Tạo category (admin)

### Products
- `GET /api/products` - Danh sách sản phẩm (filter, sort, paginate)
- `GET /api/products/:slug` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (admin)
- `PATCH /api/products/:id` - Cập nhật (admin)
- `DELETE /api/products/:id` - Xóa (soft delete, admin)

### Cart
- `GET /api/cart` - Giỏ hàng của user
- `POST /api/cart/items` - Thêm/cập nhật item
- `DELETE /api/cart/items/:productId` - Xóa item

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Danh sách đơn của user
- `GET /api/orders/:id` - Chi tiết đơn
- `GET /api/admin/orders` - Tất cả đơn (admin)
- `PATCH /api/admin/orders/:id/status` - Cập nhật trạng thái (admin)

### Reviews
- `GET /api/products/:productId/reviews` - Reviews của sản phẩm
- `POST /api/products/:productId/reviews` - Tạo review
- `PATCH /api/reviews/:id` - Sửa review (owner)
- `DELETE /api/reviews/:id` - Xóa review (owner/admin)

### Uploads
- `POST /api/uploads/images` - Upload ảnh lên Cloudinary

## Features

### Authentication
- JWT Access Token (15 phút) + Refresh Token (7 ngày)
- Password hashing với bcrypt
- Role-based access control (customer, staff, admin)

### Soft Delete
- User, Product, Category, Order, Review hỗ trợ soft delete
- Không xóa vĩnh viễn, chỉ đánh dấu `isDeleted: true`

### Image Upload
- Upload lên Cloudinary
- Auto resize/optimize
- Hỗ trợ multiple images

### Validation
- Express Validator cho input
- Mongoose schema validation
- Centralized error handling

## Lưu ý

- Đổi `JWT_SECRET` và `JWT_REFRESH_SECRET` trong production
- Cấu hình Cloudinary trước khi upload ảnh
- Tạo index MongoDB cho performance (tự động tạo khi chạy)
- Backup database định kỳ

## Next Steps

1. Implement Controllers & Routes
2. Thêm payment gateway (VNPay, MoMo)
3. Email service (forgot password, order confirmation)
4. Admin dashboard APIs
5. Rate limiting & security headers
