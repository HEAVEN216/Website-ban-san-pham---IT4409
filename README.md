<<<<<<< HEAD
# WebITBanhang

README này mô tả nhanh cách cài đặt, chạy và cấu trúc thư mục cho dự án WebITBanhang (React client + Node/Express server).

## Yêu cầu

- Node.js LTS (>= 14.x, khuyến nghị 16.x hoặc 18.x)
- npm (kèm theo Node.js) hoặc yarn
- (Nếu cần) XAMPP/MariaDB/MySQL nếu server dùng cơ sở dữ liệu SQL — kiểm tra file cấu hình trong `server/config`.

> Lưu ý: README này giả định project có hai phần riêng `client/` (front-end) và `server/` (back-end). Nếu `package.json` trong `client/` hoặc `server/` chưa được cấu hình, hãy mở các thư mục đó và điền script phù hợp.

## Cài đặt (một lần)

Mở PowerShell ở thư mục gốc `c:\xampp\htdocs\WebITBanhang` và chạy:

```powershell
# Cài dependencies cho client
cd .\client
npm install

# Quay về gốc và cài cho server (nếu có package.json)
cd ..\server
if (Test-Path package.json) { npm install } else { Write-Host 'Không tìm thấy server/package.json — kiểm tra thư mục server nếu dự án có back-end' }

# Quay lại gốc
cd ..
```

Nếu bạn dùng yarn thay cho npm, đổi `npm install` thành `yarn`.

## Chạy ở môi trường phát triển

1) Chạy client (React)

Mặc định project React thường có các script `start` và `build` trong `client/package.json`. Ở PowerShell:

```powershell
cd .\client
npm start
```

2) Chạy server (Node/Express)

Trong thư mục `server/` nếu có `package.json` thường có `start` hoặc `dev` (ví dụ sử dụng `nodemon`). Ví dụ:

```powershell
cd ..\server
# chạy dev (nếu dùng nodemon)
npm run dev
# hoặc chạy production
npm start
```

3) Chạy đồng thời (tuỳ theo cấu hình dự án)

Bạn có thể mở hai terminal riêng: một chạy client, một chạy server. Nếu muốn chạy đồng thời từ gốc, thêm script `dev` ở gốc (hoặc dùng `concurrently`) — nếu chưa có, cài và cấu hình trước khi chạy.

## Build và triển khai

- Build front-end:

```powershell
cd .\client
npm run build
```

- Sau khi build, kết quả thường được đặt trong `client/build` hoặc `client/dist`. Tùy cách server phục vụ tệp tĩnh, bạn có thể cấu hình server để phục vụ thư mục build này.

## Cấu trúc thư mục (giải thích chức năng từng thư mục)

- `README.md` — Tài liệu chính của dự án (file bạn đang đọc).
- `client/` — Mã nguồn front-end (React):
	- `package.json` — Khai báo dependencies, scripts (start, build, test).
	- `public/` — Tài nguyên tĩnh như `index.html`, favicon, manifest.
	- `src/` — Mã nguồn React chính:
		- `index.js` — Entry point, mount App vào DOM.
		- `App.js` — Component gốc, cấu hình Router và providers.
		- `components/` — Các component UI tái sử dụng.
		- `contexts/` — React Context / Providers (Auth, Cart,...).
		- `pages/` — Các trang tương ứng route.
		- `services/` — API client (axios/fetch wrappers), business logic tách UI.

- `server/` — Mã nguồn back-end (Node/Express):
	- `app.js` — Điểm khởi tạo Express, cấu hình middleware và route.
	- `config/` — Cấu hình (env, DB connection string, keys).
	- `controllers/` — Xử lý request/response cho từng route.
	- `models/` — Định nghĩa schema/ORM models (Mongoose/Sequelize,...).
	- `routes/` — Định nghĩa API endpoints.
	- `utils/` — Helper, middleware, hàm tiện ích chung.

## Scripts hữu ích gợi ý (thêm vào package.json nếu chưa có)

- Trong `client/package.json`:

```json
"scripts": {
	"start": "react-scripts start",
	"build": "react-scripts build",
	"test": "react-scripts test",
	"lint": "eslint src --ext .js,.jsx"
}
```

- Trong `server/package.json`:

```json
"scripts": {
	"start": "node app.js",
	"dev": "nodemon app.js",
	"lint": "eslint . --ext .js"
}
```

Thêm `concurrently` nếu muốn chạy client và server song song từ root:

```json
"scripts": {
	"dev": "concurrently \"npm:start-client\" \"npm:start-server\"",
	"start-client": "cd client && npm start",
	"start-server": "cd server && npm run dev"
}
```

## Ghi chú cho Windows PowerShell

- Khi copy-paste các lệnh multi-line, đảm bảo chạy trong PowerShell (không phải cmd) hoặc tách thành các lệnh riêng.
- Nếu gặp lỗi quyền thực thi (execution policy) khi cài hoặc chạy script, có thể cần chạy PowerShell với quyền admin hoặc chỉnh ExecutionPolicy tạm thời.

## Debug / Kiểm tra nhanh

- Kiểm tra Node/npm version:

```powershell
node -v
npm -v
```

- Kiểm tra port đang dùng (ví dụ port 3000 bị chiếm):

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
```

## Tiếp theo tôi có thể làm cho bạn:

- Tạo `client/package.json` hoặc `server/package.json` mẫu nếu chúng đang trống.
- Thêm script `dev` ở root để chạy cả hai phần cùng lúc.
- Tạo file `server/package.json` giả lập nếu bạn muốn chạy backend ngay.

Nếu bạn muốn, tôi sẽ áp nội dung README này vào file `README.md` (tôi đã làm) và có thể tiếp tục tạo các `package.json` mẫu hoặc script — bạn muốn tôi làm bước tiếp theo nào?
=======
# Website-ban-san-pham---IT4409
Hệ thống thương mại điện tử mini: đăng sản phẩm, giỏ hàng, thanh toán.
>>>>>>> 4cd2a2e0274ba1224cc45bf9ebe5b4de67e77528
