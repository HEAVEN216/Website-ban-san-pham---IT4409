## Hướng dẫn chạy dự án Website bán sản phẩm công nghệ (MERN)

Repo này gồm 2 phần chính:
- **Frontend**: React + Vite (trong thư mục `client/`)
- **Backend**: Node.js + Express + MongoDB (trong thư mục `server/`)

> Yêu cầu: Node.js (LTS), npm, MongoDB Atlas (hoặc MongoDB khác nếu bạn chỉnh lại `.env`).

---

## 1. Cài đặt dependencies

Clone dự án về máy, sau đó:

### 1.1. Frontend (client)

```bash
npm install
```

Lệnh này chạy ở **root** và sẽ cài deps cho Vite/React (do `package.json` nằm ở root).

### 1.2. Backend (server)

```bash
cd server
npm install
```

---

## 2. Cấu hình môi trường

Trong thư mục `server/`:

```bash
cp .env.example .env
```

Sau đó mở file `.env` và điền:

- `MONGODB_URI`, `MONGODB_DB_NAME`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `CLOUDINARY_*` nếu dùng upload ảnh
- (Tùy chọn) thông tin VNPay/MoMo sandbox nếu tích hợp thanh toán

---

## 3. Chạy dự án ở môi trường development

### 3.1. Chạy backend (Express + MongoDB)

Trong thư mục `server/`:

```bash
npm run dev
```

Mặc định backend chạy tại: `http://localhost:5000`

Kiểm tra health check:

```text
GET http://localhost:5000/health
```

### 3.2. Chạy frontend (React + Vite)

Ở **root** dự án (nơi có file `package.json` chính):

```bash
npm run dev
```

Vite mặc định chạy tại: `http://localhost:5173`

> Lưu ý: File `index.html` đã được cấu hình để load entry `client/src/main.jsx`.

---

## 4. Seed dữ liệu mẫu (tùy chọn)

Trong thư mục `server/`:

```bash
npm run seed       # tạo user, category, product mẫu
# hoặc
npm run seed:clear # xóa toàn bộ data mẫu
```

---

## 5. Deploy
`https://website-ban-san-pham-it4-24559.web.app/`


