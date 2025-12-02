# ✅ Cập Nhật Hệ Thống Role - Customer & Admin Only

**Ngày:** 02/12/2024  
**Mục tiêu:** Đơn giản hóa hệ thống role xuống còn 2: `customer` và `admin`

---

## 🎯 Yêu Cầu

### 1. **Phân chia redirect rõ ràng theo role**
- ✅ Admin login → Redirect to `/admin`
- ✅ Customer login → Redirect to `/` (homepage)

### 2. **Bỏ role `staff`**
- ✅ Chỉ giữ lại 2 roles: `customer` và `admin`
- ✅ Remove tất cả references đến `staff`
- ✅ Update seeder

### 3. **Simplify Admin Panel**
- ✅ Bỏ menu "Quản trị viên" (Admins management)
- ✅ Bỏ menu "Cài đặt" (Settings)
- ✅ Giữ lại: Dashboard, Danh mục, Sản phẩm, Người dùng, Đơn hàng, Đánh giá, Thống kê doanh thu

---

## ✅ Thay Đổi Đã Thực Hiện

### 🔐 Frontend Changes

#### 1. **Login Redirect Logic** ✅
**File:** `client/src/page-ui/LoginPage.jsx`

**Before:**
```javascript
// Generic redirect to previous page or home
navigate(from, { replace: true });
```

**After:**
```javascript
// Role-based redirect
if (result.user.role === 'admin') {
  navigate('/admin', { replace: true });
} else {
  // Customer goes to homepage
  navigate('/', { replace: true });
}
```

**Impact:**
- Admin luôn vào `/admin` dashboard
- Customer luôn vào homepage
- Clear separation of roles

---

#### 2. **Admin Sidebar Menu** ✅
**File:** `client/src/components/sidebar.jsx`

**Removed:**
- ❌ "Quản trị viên" menu item
- ❌ "Cài đặt" menu item

**Kept:**
- ✅ Dashboard
- ✅ Danh mục
- ✅ Sản phẩm
- ✅ Người dùng
- ✅ Đơn hàng
- ✅ Đánh giá
- ✅ Thống kê doanh thu

**Menu Structure:**
```javascript
const menuItems = [
  { name: "Dashboard", icon: <Home />, path: "/admin" },
  { name: "Danh mục", icon: <Package />, path: "/admin/categories" },
  { name: "Sản phẩm", icon: <Package />, path: "/admin/products" },
  { name: "Người dùng", icon: <Users />, path: "/admin/users" },
  { name: "Đơn hàng", icon: <Car />, path: "/admin/orders" },
  { name: "Đánh giá", icon: <Star />, path: "/admin/reviews" },
  { name: "Thống kê doanh thu", icon: <DollarSign />, path: "/admin/income" },
];
```

---

#### 3. **Admin Routes** ✅
**File:** `client/src/layouts/Adminlayout.jsx`

**Changes:**
- ❌ Removed `import Admins from '../pages/Admins'`
- ❌ Removed `<Route path="admins" element={<Admins />} />`

**Routes:**
```javascript
<Routes>
  <Route path="/" element={<DashboardPage />} />
  <Route path="categories" element={<Categories />} />
  <Route path="products" element={<Products />} />
  <Route path="users" element={<Users />} />
  <Route path="orders" element={<Orders />} />
  <Route path="reviews" element={<ReviewsRefactored />} />
  <Route path="income" element={<Income />} />
  <Route path="*" element={<404Page />} />
</Routes>
```

---

#### 4. **Customer Navbar** ✅
**File:** `client/src/components/CustomerNavbar.jsx`

**Before:**
```javascript
{(user?.role === 'admin' || user?.role === 'staff') && (
  <Link to="/admin">Quản trị viên</Link>
)}
```

**After:**
```javascript
{user?.role === 'admin' && (
  <Link to="/admin">Quản trị viên</Link>
)}
```

**Impact:** Only admin sees "Quản trị viên" link

---

#### 5. **Protected Routes** ✅
**File:** `client/src/App.jsx`

**Before:**
```javascript
<ProtectedRoute requiredRole={['admin', 'staff']}>
  <AdminLayout />
</ProtectedRoute>
```

**After:**
```javascript
<ProtectedRoute requiredRole="admin">
  <AdminLayout />
</ProtectedRoute>
```

**Impact:** Only `admin` role can access `/admin/*` routes

---

### 🗄️ Backend Changes

#### 6. **User Model** ✅
**File:** `server/models/User.model.js`

**Before:**
```javascript
role: {
  type: String,
  enum: ['customer', 'staff', 'admin'],
  default: 'customer'
}
```

**After:**
```javascript
role: {
  type: String,
  enum: ['customer', 'admin'],
  default: 'customer'
}
```

**Impact:** Database schema now only accepts 2 roles

---

#### 7. **User Validators** ✅
**File:** `server/validators/user.validator.js`

**Changed 2 validators:**

**getAllUsersValidator:**
```javascript
// Before
.isIn(['customer', 'staff', 'admin'])
.withMessage('Role must be one of: customer, staff, admin')

// After
.isIn(['customer', 'admin'])
.withMessage('Role must be one of: customer, admin')
```

**updateUserValidator:**
```javascript
// Before
.isIn(['customer', 'staff', 'admin'])
.withMessage('Role must be one of: customer, staff, admin')

// After
.isIn(['customer', 'admin'])
.withMessage('Role must be one of: customer, admin')
```

---

#### 8. **Role Middleware** ✅
**File:** `server/middlewares/role.middleware.js`

**Before:**
```javascript
const isAdmin = restrictTo('admin');
const isStaffOrAdmin = restrictTo('staff', 'admin');

module.exports = { restrictTo, isAdmin, isStaffOrAdmin };
```

**After:**
```javascript
const isAdmin = restrictTo('admin');

module.exports = { restrictTo, isAdmin };
```

**Impact:** 
- Removed `isStaffOrAdmin` middleware
- No routes were using it (verified via grep)

---

#### 9. **User Controller** ✅
**File:** `server/controllers/user.controller.js`

**updateUser function:**
```javascript
// Before
if (!['customer', 'staff', 'admin'].includes(role)) {
  throw ApiError.badRequest('Invalid role');
}

// After
if (!['customer', 'admin'].includes(role)) {
  throw ApiError.badRequest('Invalid role');
}
```

---

#### 10. **Seed Data** ✅
**File:** `server/seeders/seed.js`

**Removed staff user:**
```javascript
// REMOVED THIS BLOCK:
{
  email: 'staff@it4409.com',
  password: 'staff123',
  fullName: 'Lê Văn Nhân Viên',
  username: 'staff',
  phone: '0123456787',
  role: 'staff',
  isEmailVerified: true
}
```

**Seed users now:**
- ✅ 2 Admins (admin@it4409.com, admin2@it4409.com)
- ✅ 5 Customers (customer1-5@it4409.com)

---

## 📊 Summary of Changes

### Files Modified: 10

#### Frontend (5 files):
1. ✅ `client/src/page-ui/LoginPage.jsx` - Role-based redirect
2. ✅ `client/src/components/sidebar.jsx` - Removed menu items
3. ✅ `client/src/layouts/Adminlayout.jsx` - Removed Admins route
4. ✅ `client/src/components/CustomerNavbar.jsx` - Only admin sees link
5. ✅ `client/src/App.jsx` - Only admin role for /admin/*

#### Backend (5 files):
6. ✅ `server/models/User.model.js` - 2 roles only
7. ✅ `server/validators/user.validator.js` - 2 roles validation
8. ✅ `server/middlewares/role.middleware.js` - Removed isStaffOrAdmin
9. ✅ `server/controllers/user.controller.js` - 2 roles validation
10. ✅ `server/seeders/seed.js` - Removed staff user

---

## 🎯 Role Matrix

| Role | Can Access | Redirect After Login |
|------|-----------|---------------------|
| **customer** | `/` `/products` `/product/:slug` `/cart` `/checkout` `/orders` | `/` (Homepage) |
| **admin** | All customer routes + `/admin/*` | `/admin` (Dashboard) |
| **staff** | ❌ REMOVED | N/A |

---

## 🧪 Testing Guide

### Test Admin Login:
```bash
# Admin account
Email: admin@it4409.com
Password: admin123

Expected behavior:
1. Login successful
2. Redirect to /admin (Dashboard)
3. See full admin panel với 7 menu items
4. Can manage all resources
```

### Test Customer Login:
```bash
# Customer account
Email: customer1@it4409.com
Password: customer123

Expected behavior:
1. Login successful
2. Redirect to / (Homepage)
3. See CustomerNavbar with user dropdown
4. Can access cart, checkout, orders
5. CANNOT access /admin (will redirect to /)
```

### Test Customer Navbar Dropdown:
```
For Customer:
- [Avatar + Name]
  ├─ Đơn hàng của tôi
  ├─ Giỏ hàng
  └─ Đăng xuất

For Admin:
- [Avatar + Name]
  ├─ Đơn hàng của tôi
  ├─ Giỏ hàng
  ├─ Quản trị viên ⭐ (extra link)
  └─ Đăng xuất
```

---

## 🔄 Database Migration

### Run Seeder:
```bash
cd server
npm run seed
```

**What happens:**
- ✅ Clears all existing data
- ✅ Creates 2 admins
- ✅ Creates 5 customers
- ✅ NO staff users
- ✅ Creates sample products, categories, etc.

### Manual Migration (if needed):
```javascript
// MongoDB query to update existing staff users to customer
db.users.updateMany(
  { role: 'staff' },
  { $set: { role: 'customer' } }
)

// Or delete staff users
db.users.deleteMany({ role: 'staff' })
```

---

## ⚠️ Breaking Changes

### For Existing Users:
1. **All `staff` users will be blocked** if not migrated
2. **Must re-seed database** or manually update users
3. **Old tokens with `staff` role will fail** validation

### For Developers:
1. Cannot use `isStaffOrAdmin` middleware anymore
2. Only use `isAdmin` for admin-only routes
3. Role validation now rejects `staff`

---

## 🎨 Admin Panel Structure

### Before (9 items):
```
├─ Dashboard
├─ Danh mục
├─ Sản phẩm
├─ Người dùng
├─ Quản trị viên ❌
├─ Đơn hàng
├─ Đánh giá
├─ Thống kê doanh thu
└─ Cài đặt ❌
```

### After (7 items):
```
├─ Dashboard
├─ Danh mục
├─ Sản phẩm
├─ Người dùng
├─ Đơn hàng
├─ Đánh giá
└─ Thống kê doanh thu
```

**Removed:** Quản trị viên, Cài đặt  
**Reason:** Simplified admin panel, no need for admin self-management

---

## ✅ Verification Checklist

### Frontend:
- [x] Login redirects correctly (admin → /admin, customer → /)
- [x] Admin sidebar has 7 items
- [x] No "Quản trị viên" menu
- [x] No "Cài đặt" menu
- [x] /admin/admins route removed
- [x] Only admin sees "Quản trị viên" in CustomerNavbar
- [x] ProtectedRoute only checks 'admin'

### Backend:
- [x] User model enum: ['customer', 'admin']
- [x] Validators accept only 2 roles
- [x] isStaffOrAdmin middleware removed
- [x] User controller validates 2 roles
- [x] Seeder creates no staff users

---

## 📝 Notes

### Role Philosophy:
- **Simple is better:** 2 roles are easier to manage than 3
- **Clear separation:** Admin manages, customer shops
- **No middle ground:** Staff role was unclear in permissions

### Future Considerations:
If staff role is needed later:
1. Add back to User model enum
2. Update validators
3. Create `isStaffOrAdmin` middleware
4. Define clear permission boundaries
5. Update seed data

---

## 🚀 Deployment Steps

### 1. Deploy Backend:
```bash
cd server
npm run seed  # Clear and re-seed database
npm start     # Start server
```

### 2. Deploy Frontend:
```bash
cd client
npm run build  # Build production
npm run dev    # Or start dev server
```

### 3. Test:
```bash
# Test admin login
Email: admin@it4409.com
Password: admin123

# Test customer login
Email: customer1@it4409.com
Password: customer123
```

---

## ✅ Summary

### Completed:
1. ✅ Role-based login redirect (admin → /admin, customer → /)
2. ✅ Simplified admin sidebar (7 items, removed 2)
3. ✅ Removed staff role from entire system
4. ✅ Updated all validators and middlewares
5. ✅ Updated seed data
6. ✅ Only admin can access admin panel

### Benefits:
- 🎯 Clear role separation
- 🚀 Simpler codebase
- 🔒 Better security (less roles = less confusion)
- 📊 Easier to maintain
- 🧪 Easier to test

---

**🎉 Hệ thống giờ chỉ còn 2 roles rõ ràng: Customer & Admin!**

---

**Generated:** 02/12/2024  
**Status:** ✅ Complete and ready for testing
