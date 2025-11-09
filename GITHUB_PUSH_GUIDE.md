# Hướng dẫn Push Dự án lên GitHub

## Tình trạng hiện tại

✅ Git repository đã được khởi tạo  
✅ Remote repository đã được cấu hình: `https://github.com/HEAVEN216/Website-ban-san-pham---IT4409.git`  
✅ Đang ở branch: `feature/auth-api`  
✅ File `.gitignore` đã được tạo (các file Postman sẽ không được đẩy lên)

---

## Các bước Push lên GitHub

### Bước 1: Kiểm tra trạng thái Git

```bash
cd "C:\Learn_20251\CNWEB\BTL\Website-ban-san-pham---IT4409"
git status
```

Bạn sẽ thấy:
- **M** (Modified): Các file đã được sửa đổi
- **??** (Untracked): Các file mới chưa được track

---

### Bước 2: Thêm các file vào staging area

#### Cách 1: Thêm tất cả các file (Khuyến nghị)
```bash
git add .
```

#### Cách 2: Thêm từng file cụ thể
```bash
# Thêm file mới
git add server/.gitignore
git add server/controllers/auth.controller.js
git add server/routes/auth.routes.js
git add server/HTTP_METHODS_GUIDE.md

# Thêm file đã sửa đổi
git add server/app.js
git add server/middlewares/error.middleware.js
git add server/utils/ApiError.js
git add server/package.json
git add server/package-lock.json
```

**Lưu ý**: Các file Postman sẽ KHÔNG được thêm vì đã có trong `.gitignore`

---

### Bước 3: Commit các thay đổi

```bash
git commit -m "feat: Thêm API đăng ký và đăng nhập

- Thêm auth controller với register, login, logout, getMe
- Thêm auth routes
- Cập nhật error handling để hỗ trợ validation errors
- Thêm .gitignore để bỏ qua file Postman
- Thêm hướng dẫn HTTP methods"
```

**Lưu ý về commit message**:
- Sử dụng format: `type: description`
- Types phổ biến: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Mô tả ngắn gọn, rõ ràng

---

### Bước 4: Push lên GitHub

#### Nếu branch chưa được push lần đầu:
```bash
git push -u origin feature/auth-api
```

#### Nếu branch đã được push trước đó:
```bash
git push
```

**Giải thích**:
- `-u origin feature/auth-api`: Set upstream branch (chỉ cần làm 1 lần)
- `origin`: Tên remote repository
- `feature/auth-api`: Tên branch

---

### Bước 5: Kiểm tra trên GitHub

1. Mở trình duyệt
2. Truy cập: `https://github.com/HEAVEN216/Website-ban-san-pham---IT4409`
3. Chuyển sang branch `feature/auth-api`
4. Kiểm tra các file đã được push

---

## Xử lý lỗi thường gặp

### Lỗi 1: "Updates were rejected"

**Nguyên nhân**: Remote repository có commit mới mà local chưa có

**Giải pháp**:
```bash
# Pull các thay đổi mới nhất
git pull origin feature/auth-api

# Nếu có conflict, giải quyết conflict rồi:
git add .
git commit -m "Merge remote changes"
git push
```

---

### Lỗi 2: "Authentication failed"

**Nguyên nhân**: Chưa đăng nhập GitHub hoặc token hết hạn

**Giải pháp**:
1. Sử dụng Personal Access Token (PAT)
2. Hoặc cấu hình SSH key

**Cách tạo Personal Access Token**:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Chọn quyền: `repo`
4. Copy token và sử dụng khi push

---

### Lỗi 3: "Branch not found"

**Nguyên nhân**: Branch chưa tồn tại trên remote

**Giải pháp**:
```bash
git push -u origin feature/auth-api
```

---

## Workflow khuyến nghị

### 1. Trước khi push:
```bash
# Kiểm tra trạng thái
git status

# Xem các thay đổi
git diff

# Kiểm tra .gitignore
git check-ignore -v <file-name>
```

### 2. Commit và Push:
```bash
# Thêm file
git add .

# Commit
git commit -m "feat: Mô tả thay đổi"

# Push
git push
```

### 3. Sau khi push:
- Kiểm tra trên GitHub
- Tạo Pull Request nếu cần merge vào main branch

---

## Checklist trước khi Push

- [ ] Đã kiểm tra `git status`
- [ ] Đã thêm các file cần thiết (`git add`)
- [ ] Đã commit với message rõ ràng
- [ ] Đã kiểm tra `.gitignore` (không commit file nhạy cảm)
- [ ] Đã pull các thay đổi mới nhất (nếu có)
- [ ] Đã test code trước khi push

---

## Lưu ý quan trọng

### ✅ Nên commit:
- Source code (`.js`, `.jsx`, `.ts`, etc.)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Documentation (`.md` files)
- `.gitignore`
- `package-lock.json` (để đảm bảo version consistency)

### ❌ KHÔNG nên commit:
- `node_modules/` (đã có trong `.gitignore`)
- `.env` files (chứa thông tin nhạy cảm)
- File Postman (đã có trong `.gitignore`)
- Log files
- Build files (`dist/`, `build/`)

---

## Quick Commands

```bash
# Kiểm tra trạng thái
git status

# Thêm tất cả file
git add .

# Commit
git commit -m "feat: Mô tả"

# Push
git push

# Xem log
git log --oneline

# Xem remote
git remote -v
```

---

## Tóm tắt nhanh

1. **Kiểm tra**: `git status`
2. **Thêm file**: `git add .`
3. **Commit**: `git commit -m "feat: Mô tả"`
4. **Push**: `git push` hoặc `git push -u origin feature/auth-api`

Chúc bạn push thành công! 🚀

