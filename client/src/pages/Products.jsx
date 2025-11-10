{/* 
  Mô tả chi tiết về trang quản lý sản phẩm (Products) cho admin:
  Các thành phần cơ bản phải có:
  - Tiêu đề trang: "Quản lý Sản phẩm"
  - Mô tả ngắn về chức năng của trang.
  - Một nút "thêm sản phẩm mới" mở ra một form để nhập thông tin sản phẩm (tên, mô tả, giá cả, số lượng, v.v.).
    Form này sẽ là một giao diện riêng.
  - Một thanh tìm kiếm để lọc sản phẩm theo tên hoặc mô tả.
  - Một bảng liệt kê tất cả sản phẩm với các cột: ID, Tên sản phẩm, Mô tả, Giá cả, Số lượng, Hành động.
  - Trong cột Hành động, sẽ có các nút xem chi tiết, chỉnh sửa hoặc xóa sản phẩm.
  - Khi nhấn nút chỉnh sửa, một form tương tự như form thêm sản phẩm mới sẽ xuất hiện với thông tin đã được điền sẵn. Trang này phải hiện trên một giao diện độc lập, không được xuất hiện ở trên bảng danh sách sản phẩm
  - Khi nhấn nút xóa, sẽ có một hộp thoại xác nhận trước khi thực hiện hành động xóa.
  - Hiển thị thông báo lỗi nếu có vấn đề trong quá trình thêm, chỉnh sửa hoặc xóa sản phẩm (ví dụ: tên sản phẩm không được để trống).
  - Khi ấn vào nút xem chi tiết, sẽ hiển thị tất cả thông tin liên quan đến sản phẩm đó trên một giao diện riêng biệt.
  - Khi không có sản phẩm nào trong danh sách, hiển thị một thông báo thân thiện cho người dùng biết rằng không có sản phẩm nào được tìm thấy.
  Yêu cầu kỹ thuật:
  - Sử dụng React và Tailwind CSS để xây dựng giao diện người dùng. 
  - Quản lý trạng thái bằng React Hooks (useState, useEffect).
  - Mã phải rõ ràng, có chú thích và dễ bảo trì.
  */}


import React, { useState } from "react";
import { Eye, Pencil, Trash2, Search, Plus } from "lucide-react";

const initialProducts = [
  { id: 1, name: "Tai nghe Bluetooth", description: "Tai nghe không dây, pin 20h", price: 590000, quantity: 20 },
  { id: 2, name: "Chuột Logitech G102", description: "Chuột chơi game RGB", price: 390000, quantity: 50 },
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ id: null, name: "", description: "", price: "", quantity: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");
  const [nextId, setNextId] = useState(3);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  // Mở form thêm sản phẩm mới
  const handleAddNew = () => {
    setForm({ id: null, name: "", description: "", price: "", quantity: "" });
    setIsEditing(false);
    setError("");
    setIsFormVisible(true);
  };

  // Mở form chỉnh sửa
  const handleEdit = (product) => {
    setForm(product);
    setIsEditing(true);
    setError("");
    setIsFormVisible(true);
  };

  // Mở giao diện chi tiết
  const handleView = (product) => {
    setSelectedProduct(product);
    setIsDetailVisible(true);
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${prod.name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Lưu sản phẩm (Thêm / Cập nhật)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Tên sản phẩm không được để trống.");
      return;
    }
    if (!form.price || form.price <= 0) {
      setError("Giá sản phẩm phải lớn hơn 0.");
      return;
    }
    if (isEditing) {
      setProducts((prev) => prev.map((p) => (p.id === form.id ? { ...form, price: Number(form.price), quantity: Number(form.quantity) } : p)));
    } else {
      setProducts((prev) => [
        ...prev,
        {
          id: nextId,
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          quantity: Number(form.quantity),
        },
      ]);
      setNextId((id) => id + 1);
    }
    setForm({ id: null, name: "", description: "", price: "", quantity: "" });
    setIsFormVisible(false);
    setIsEditing(false);
  };

  return (
    <div className="p-8 md:p-10 lg:p-12">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Quản lý Sản phẩm</h1>
          <p className="mt-2 text-gray-600">Thêm, chỉnh sửa, xem chi tiết hoặc xóa sản phẩm.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Thêm sản phẩm mới
        </button>
      </header>

      {/* Thanh tìm kiếm */}
      {!isFormVisible && !isDetailVisible && (
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-10 border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">{filtered.length}</span> sản phẩm (tổng {products.length})
          </div>
        </div>
      )}

      {/* Giao diện danh sách sản phẩm */}
      {!isFormVisible && !isDetailVisible && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số lượng</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào. Hãy thử thêm mới hoặc thay đổi từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-600">{p.id}</td>
                    <td className="px-6 py-3 text-gray-800 font-medium">{p.name}</td>
                    <td className="px-6 py-3 text-gray-600">{p.description}</td>
                    <td className="px-6 py-3 text-gray-600">{p.price.toLocaleString()} ₫</td>
                    <td className="px-6 py-3 text-gray-600">{p.quantity}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="inline-flex gap-3">
                        <button onClick={() => handleView(p)} title="Xem chi tiết" className="p-2 hover:bg-gray-100 rounded-full">
                          <Eye size={20} className="text-blue-600" />
                        </button>
                        <button onClick={() => handleEdit(p)} title="Chỉnh sửa" className="p-2 hover:bg-gray-100 rounded-full">
                          <Pencil size={20} className="text-amber-600" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} title="Xóa" className="p-2 hover:bg-red-50 rounded-full">
                          <Trash2 size={20} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form thêm / sửa sản phẩm */}
      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-gray-200 text-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá (₫)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border bg-white border-gray-200 text-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full border bg-white border-gray-200 text-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border bg-white border-gray-200 text-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            {error && <p className="text-sm text-red-600 col-span-2">{error}</p>}
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button type="submit" className={`px-6 py-3 rounded-md text-white font-medium ${isEditing ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </button>
              <button type="button" onClick={() => setIsFormVisible(false)} className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trang xem chi tiết sản phẩm */}
      {isDetailVisible && selectedProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết sản phẩm</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>ID:</strong> {selectedProduct.id}</p>
            <p><strong>Tên:</strong> {selectedProduct.name}</p>
            <p><strong>Mô tả:</strong> {selectedProduct.description}</p>
            <p><strong>Giá:</strong> {selectedProduct.price.toLocaleString()} ₫</p>
            <p><strong>Số lượng:</strong> {selectedProduct.quantity}</p>
          </div>
          <button onClick={() => setIsDetailVisible(false)} className="mt-6 px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800">
            Quay lại
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;

