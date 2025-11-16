# Hướng dẫn về HTTP Methods trong RESTful API

## Tổng quan về HTTP Methods

### 1. GET - Đọc dữ liệu
**Mục đích**: Lấy thông tin, không thay đổi dữ liệu

**Đặc điểm**:
- ✅ Có thể cache
- ✅ Có thể bookmark
- ✅ Có thể gửi qua URL (query string)
- ❌ Không có request body
- ❌ Không nên dùng để thay đổi dữ liệu

**Ví dụ trong API của bạn**:
```javascript
// ✅ ĐÚNG - Lấy thông tin user
GET /api/auth/me
GET /api/products
GET /api/products/:id
```

**Khi nào dùng GET**:
- Lấy danh sách sản phẩm
- Lấy thông tin user
- Tìm kiếm (search)
- Xem chi tiết một item

---

### 2. POST - Tạo dữ liệu mới
**Mục đích**: Tạo resource mới

**Đặc điểm**:
- ✅ Có request body
- ✅ Không bị cache
- ✅ Bảo mật hơn (dữ liệu trong body)
- ❌ Không thể bookmark
- ❌ Không idempotent (gọi nhiều lần tạo nhiều resource)

**Ví dụ trong API của bạn**:
```javascript
// ✅ ĐÚNG - Tạo user mới
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A"
}

// ✅ ĐÚNG - Đăng nhập
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

**Khi nào dùng POST**:
- Đăng ký tài khoản
- Đăng nhập
- Tạo đơn hàng
- Tạo sản phẩm mới
- Upload file

---

### 3. PUT - Cập nhật toàn bộ
**Mục đích**: Cập nhật toàn bộ resource (thay thế)

**Đặc điểm**:
- ✅ Có request body
- ✅ Idempotent (gọi nhiều lần kết quả giống nhau)
- ✅ Cập nhật toàn bộ resource

**Ví dụ**:
```javascript
// Cập nhật toàn bộ thông tin user
PUT /api/users/:id
Body: {
  "email": "new@example.com",
  "fullName": "Tên mới",
  "phone": "0987654321"
}
```

---

### 4. PATCH - Cập nhật một phần
**Mục đích**: Cập nhật một phần resource

**Đặc điểm**:
- ✅ Có request body
- ✅ Chỉ cập nhật các field được gửi
- ✅ Idempotent

**Ví dụ**:
```javascript
// Chỉ cập nhật email
PATCH /api/users/:id
Body: {
  "email": "newemail@example.com"
}
```

---

### 5. DELETE - Xóa dữ liệu
**Mục đích**: Xóa resource

**Đặc điểm**:
- ❌ Không có request body
- ✅ Idempotent
- ✅ Xóa resource

**Ví dụ**:
```javascript
// Xóa user
DELETE /api/users/:id
```

---

## So sánh GET vs POST

| Đặc điểm | GET | POST |
|----------|-----|------|
| **Mục đích** | Đọc dữ liệu | Tạo dữ liệu |
| **Request Body** | ❌ Không có | ✅ Có |
| **Dữ liệu gửi** | Query string | Body (JSON) |
| **Bảo mật** | ⚠️ Dễ bị lộ (trong URL) | ✅ An toàn hơn |
| **Cache** | ✅ Có thể cache | ❌ Không cache |
| **Idempotent** | ✅ Có | ❌ Không |
| **Bookmark** | ✅ Có thể | ❌ Không thể |
| **Kích thước** | ⚠️ Giới hạn (~2048 ký tự) | ✅ Không giới hạn |

---

## Tại sao đăng ký phải dùng POST?

### ❌ KHÔNG THỂ dùng GET vì:

1. **Không có request body**:
   ```javascript
   // ❌ KHÔNG THỂ làm thế này với GET
   GET /api/auth/register?email=user@example.com&password=123456
   // Vấn đề:
   // - Password hiển thị trong URL (rất nguy hiểm!)
   // - URL quá dài
   // - Dễ bị log/cache
   ```

2. **Bảo mật kém**:
   - URL có thể bị log trong server logs
   - URL có thể bị lưu trong browser history
   - URL có thể bị chia sẻ nhầm
   - Password hiển thị trong URL bar

3. **Không đúng chuẩn REST**:
   - GET không nên thay đổi trạng thái server
   - Đăng ký tạo user mới = thay đổi trạng thái

### ✅ PHẢI dùng POST vì:

1. **Có request body**:
   ```javascript
   // ✅ ĐÚNG
   POST /api/auth/register
   Body: {
     "email": "user@example.com",
     "password": "password123",
     "fullName": "Nguyễn Văn A"
   }
   ```

2. **Bảo mật tốt hơn**:
   - Dữ liệu trong body, không hiển thị trong URL
   - Không bị cache
   - Không bị lưu trong browser history

3. **Đúng chuẩn REST**:
   - POST dùng để tạo resource mới
   - Đăng ký = tạo user mới = POST

---

## Ví dụ thực tế

### ✅ ĐÚNG - Dùng POST cho đăng ký:
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A"
}
```

### ❌ SAI - Dùng GET cho đăng ký:
```javascript
// ❌ KHÔNG BAO GIỜ làm thế này!
GET /api/auth/register?email=user@example.com&password=123456
// Vấn đề:
// 1. Password hiển thị trong URL
// 2. URL có thể bị log
// 3. Không đúng chuẩn REST
```

---

## Best Practices

### 1. Khi nào dùng GET:
- ✅ Lấy danh sách: `GET /api/products`
- ✅ Lấy chi tiết: `GET /api/products/:id`
- ✅ Tìm kiếm: `GET /api/products?search=laptop`
- ✅ Lấy thông tin user: `GET /api/auth/me`

### 2. Khi nào dùng POST:
- ✅ Tạo mới: `POST /api/auth/register`
- ✅ Đăng nhập: `POST /api/auth/login`
- ✅ Tạo đơn hàng: `POST /api/orders`
- ✅ Upload file: `POST /api/upload`

### 3. Khi nào dùng PUT/PATCH:
- ✅ Cập nhật: `PATCH /api/users/:id`
- ✅ Cập nhật toàn bộ: `PUT /api/users/:id`

### 4. Khi nào dùng DELETE:
- ✅ Xóa: `DELETE /api/users/:id`

---

## Tóm tắt

**Câu trả lời ngắn gọn**: 

Không thể dùng GET cho đăng ký vì:
1. ❌ GET không có request body (không thể gửi password an toàn)
2. ❌ GET không đúng chuẩn REST (GET chỉ để đọc, không để tạo)
3. ❌ GET không an toàn (dữ liệu hiển thị trong URL)

**Phải dùng POST** vì:
1. ✅ POST có request body (gửi dữ liệu an toàn)
2. ✅ POST đúng chuẩn REST (POST để tạo resource mới)
3. ✅ POST an toàn hơn (dữ liệu trong body, không hiển thị trong URL)

---

## Kết luận

Trong Postman, khi test API đăng ký:
- ✅ **Method**: `POST`
- ✅ **URL**: `http://localhost:5000/api/auth/register`
- ✅ **Headers**: `Content-Type: application/json`
- ✅ **Body**: JSON với email, password, fullName...

Không dùng GET cho các thao tác tạo dữ liệu! 🚫









