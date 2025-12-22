# 🚀 PHASE 3 & 4 IMPLEMENTATION GUIDE

**Status**: Products Page ✅ COMPLETED | Others 📝 TEMPLATES PROVIDED

---

## ✅ PHASE 3.1: Products Page - COMPLETED

File đã được tạo: `client/src/pages/Products.jsx`

**Features đã triển khai:**
- ✅ Fetch products từ API với pagination
- ✅ Search products
- ✅ Create new product
- ✅ Edit product
- ✅ Delete product
- ✅ View product details modal
- ✅ Category dropdown
- ✅ Loading & error states
- ✅ Beautiful UI with Tailwind
- ✅ Image preview
- ✅ Price formatting (VND)

---

## 📝 PHASE 3.2: Users Page - TEMPLATE

**File**: `client/src/pages/Users.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Search, Plus, X } from "lucide-react";
import { userService } from "../services";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "customer"
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        page: currentPage,
        limit: 10,
        search: search || undefined
      });
      
      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
        alert("Xóa user thành công!");
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await userService.updateUser(userId, { role: newRole });
      fetchUsers();
      alert("Cập nhật role thành công!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  // ... render UI tương tự Products Page
  // Table với columns: Avatar, Tên, Email, Phone, Role, Verified, Actions
  // Actions: View, Edit Role, Delete
};

export default UsersPage;
```

**Key features to implement:**
- List all users with pagination
- Search by name/email
- View user details (orders, addresses)
- Update user role (customer/staff/admin)
- Delete user
- Show email verification status
- Filter by role

---

## 📝 PHASE 3.3: Orders Page (Admin) - TEMPLATE

**File**: `client/src/pages/Carts.jsx` (rename to Orders.jsx)

```jsx
import React, { useState, useEffect } from "react";
import { Package, Eye, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { orderService } from "../services";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, processing, completed, cancelled
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAdminOrders({
        status: filter !== "all" ? filter : undefined
      });
      
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý", icon: Clock },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Đang xử lý", icon: Truck },
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Hoàn thành", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy", icon: XCircle }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  // ... render UI
  // Filter tabs: All, Pending, Processing, Completed, Cancelled
  // Table: Order Number, Customer, Total, Status, Payment, Date, Actions
  // Order detail modal: Items, Shipping info, Payment info, Status history
  // Status update dropdown: pending → processing → completed
};

export default OrdersPage;
```

**Key features:**
- List all orders
- Filter by status
- View order details (items, customer info, shipping)
- Update order status (admin action)
- Show payment status
- Calculate totals
- Order timeline/history

---

## 📝 PHASE 3.4: Categories Page - TEMPLATE

**File**: `client/src/pages/Categories.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Pencil, Trash2 } from "lucide-react";
import { categoryService } from "../services";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategoryTree();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await categoryService.updateCategory(formData._id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      fetchCategories();
      setIsFormVisible(false);
      alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa danh mục này?")) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // ... render tree structure UI
  // Hierarchical display with parent-child relationships
  // Add/Edit/Delete actions
};

export default CategoriesPage;
```

**Key features:**
- Tree structure display
- CRUD operations
- Parent-child relationships
- Product count per category

---

## 📝 PHASE 4.1: Home Page (User-facing) - TEMPLATE

**File**: `client/src/page-ui/HomePageReal.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { productService } from "../services";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured products (first 8)
      const productsRes = await productService.getProducts({ limit: 8 });
      if (productsRes.success) {
        setFeaturedProducts(productsRes.data.products);
      }

      // Fetch categories
      const categoriesRes = await categoryService.getCategories();
      if (categoriesRes.success) {
        setCategories(categoriesRes.data.categories);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Chào mừng đến với Tech Store</h1>
          <p className="text-xl mb-8">Sản phẩm công nghệ chính hãng, giá tốt nhất</p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Mua sắm ngay
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-gray-800">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{cat.productCount || 0} sản phẩm</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <Link to={`/product/${product.slug}`}>
                <img
                  src={product.images[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">(4.5)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
                    {product.discount > 0 && (
                      <p className="text-xs text-gray-500 line-through">{formatPrice(product.price / (1 - product.discount / 100))}</p>
                    )}
                  </div>
                  <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

---

## 📝 PHASE 4.2: Product Detail Page - TEMPLATE

**File**: `client/src/page-ui/ProductDetailPageReal.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star, Minus, Plus } from "lucide-react";
import { productService, cartService } from "../services";
import { useAuth } from "../contexts/AuthContext";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProductBySlug(slug);
      if (response.success) {
        setProduct(response.data.product);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await cartService.addItem(product._id, quantity);
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <img
            src={product.images[selectedImage] || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full rounded-lg mb-4"
          />
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className={`cursor-pointer rounded border-2 ${selectedImage === idx ? 'border-blue-600' : 'border-gray-200'}`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-600">(150 đánh giá)</span>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4">
              <p className="text-4xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </p>
              {product.discount > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  -{product.discount}%
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Thông số kỹ thuật</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}:</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus size={18} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-x border-gray-300 py-2"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-sm text-gray-600">{product.stock} sản phẩm có sẵn</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Thêm vào giỏ hàng
            </button>
            <button className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
```

---

## 📝 PHASE 4.3: Cart Page - TEMPLATE

**File**: `client/src/page-ui/CartPageReal.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { cartService } from "../services";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await cartService.updateItem(productId, newQuantity);
      fetchCart();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.removeItem(productId);
      fetchCart();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div>Loading...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Giỏ hàng trống</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex gap-4 p-4 border-b last:border-b-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.brand}</p>
                  <p className="text-blue-600 font-semibold mt-2">{formatPrice(item.priceAtAdd)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tổng đơn hàng</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">{formatPrice(calculateTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-semibold">{formatPrice(30000)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-semibold">Tổng cộng:</span>
                <span className="text-lg font-bold text-blue-600">{formatPrice(calculateTotal() + 30000)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
```

---

## 📝 PHASE 4.4: Checkout Page - TEMPLATE

**File**: `client/src/page-ui/CheckoutPageReal.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService, cartService } from "../services";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    paymentMethod: "COD",
    couponCode: "",
    note: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          ward: formData.ward,
          district: formData.district,
          city: formData.city
        },
        paymentMethod: formData.paymentMethod,
        couponCode: formData.couponCode || undefined,
        note: formData.note
      };

      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        alert("Đặt hàng thành công!");
        navigate("/orders");
      }
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // ... render form với shipping info, payment method, order summary
};

export default CheckoutPage;
```

---

## 📝 PHASE 4.5: Order History Page - TEMPLATE

**File**: `client/src/page-ui/OrderHistoryPage.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { orderService } from "../services";
import { Package, Eye } from "lucide-react";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    const labels = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      completed: "Hoàn thành",
      cancelled: "Đã hủy"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // ... render orders list
};

export default OrderHistoryPage;
```

---

## 🛠️ NEXT STEPS

### Để hoàn thành tất cả các pages:

1. **Copy templates above** vào các files tương ứng
2. **Adjust UI** theo design của bạn
3. **Test từng page** với backend
4. **Add error handling** đầy đủ
5. **Polish UX** (loading states, animations)

### Files cần tạo/update:

```
client/src/pages/
├── Products.jsx          ✅ DONE
├── Users.jsx            📝 Use template
├── Orders.jsx           📝 Use template (rename from Carts.jsx)
└── Categories.jsx       📝 Use template

client/src/page-ui/
├── HomePage.jsx         📝 Use template (or rename old one)
├── ProductDetailPage.jsx 📝 Use template
├── CartPage.jsx         📝 Use template  
├── CheckoutPage.jsx     📝 Use template
└── OrderHistoryPage.jsx 📝 NEW - Use template
```

### Update Routes in App.jsx:

```jsx
// Add user-facing routes
<Route path="/" element={<HomePage />} />
<Route path="/products" element={<ProductListPage />} />
<Route path="/product/:slug" element={<ProductDetailPage />} />
<Route path="/cart" element={<CartPage />} />
<Route path="/checkout" element={
  <ProtectedRoute>
    <CheckoutPage />
  </ProtectedRoute>
} />
<Route path="/orders" element={
  <ProtectedRoute>
    <OrderHistoryPage />
  </ProtectedRoute>
} />
```

---

## ✅ SUMMARY

- ✅ **Products Page**: Fully implemented with API
- 📝 **Other Admin Pages**: Templates provided
- 📝 **User Pages**: Templates provided
- 🔧 **Ready to customize** and deploy!

Tất cả templates đã được chuẩn bị sẵn sàng để triển khai! 🚀
