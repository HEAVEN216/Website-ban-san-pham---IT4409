{/* 
  trang quản lý user , tại đây admin có thể:
  - xem danh sách user
  - xóa user
  - xem chi tiết thông tin user (khi bấm vào nút xem chi tiết sẽ hiện ra một modal hoặc chuyển trang mới hiển thị các thông tin chi tiết của user đó)
  thông tin về user bao gồm:
    + username : là tên đăng nhập
    + password : là mật khẩu đăng nhập , nhưng sẽ hiển thị dưới dạng mã hóa để bảo mật,
                 mật khẩu lưu trong CSDL cũng là mật khẩu đã mã hóa (hash) chứ không lưu bản gốc
  Khi user đăng ký tài khoản mới , hệ thống sẽ tự động thêm user đó vào CSDL và hiển thị ở trang quản lý này.
  */}



import React, { useState } from "react";
import { Pencil, Trash2, Search , Eye } from "lucide-react";

const initialData = [
  { id: 1, username: "admin001", password: "1225487" , adminrealname: "Nguyen Van A" , civilcode: "123456789"  },
  { id: 2, username: "admin002", password: "1422563" , adminrealname: "Tran Thi B" , civilcode: "987654321"  },
];

const Users = () => {
  const [users, setUsers] = useState(initialData);
  const [search, setSearch] = useState("");
  // Filtering
  const filtered = users.filter((c) =>
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    const cat = users.find((c) => c.id === id);
    if (!cat) return;
    if (window.confirm(`Xóa danh mục "${cat.name}"? Hành động không thể hoàn tác.`)) {
      setUsers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-8 md:p-10 lg:p-12">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 leading-tight">Quản lý tài khoản user</h1>
        <p className="mt-2 text-base text-gray-600 leading-7">
          Theo dõi và quản lý tài khoản user trong hệ thống.(Chức năng : tự động thêm khi user đăng ký , xóa khi cần , không có chức năng chỉnh sửa)
        </p>
      </header>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 leading-tight">Danh sách tài khoản user</h1>
      </header>

      {/* 
          
      
      */}

      {/* Table card */}
      <section>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Username</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Password</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Chưa có danh mục phù hợp. Hãy thử thay đổi từ khoá tìm kiếm hoặc thêm danh mục mới.
                  </td>
                </tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 focus-within:bg-gray-50">
                    <td className="px-6 py-4 align-middle text-sm text-gray-600">{cat.id}</td>
                    <td className="px-6 py-4 align-middle text-sm text-gray-800 font-medium">{cat.username}</td>
                    <td className="px-6 py-4 align-middle text-sm text-gray-800 font-medium">{cat.password}</td>
                    <td className="px-6 py-4 align-middle text-sm text-center">
                      <div className="inline-flex gap-3 items-center">
                        {/* Sẽ có 2 nút ở đây :
                           - Một nút cho phép quản trị viên xem thông tin chi tiết của người dùng,
                             Khi nhấn vào nút này, một modal sẽ hiển thị với tất cả thông tin liên quan đến người dùng đó.
                           - Một nút để vô hiệu hóa hoặc xóa tài khoản người dùng khỏi hệ thống.
                         */}
                        <button
                          onClick={() => /* Cần một hàm có chức năng truy cập vào CSDL và lấy ra các thông tin chi tiết của user, sau đó hiển thị trên một giao diện khác */ {}}
                          title="Chỉnh sửa"
                          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                          aria-label={`Chỉnh sửa ${cat.name}`}
                        >
                          <Eye size={20} className="text-blue-800" />
                        </button>

                        <button
                          onClick={() => handleDelete(cat.id)}
                          title="Xóa"
                          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-red-50 transition"
                          aria-label={`Xóa ${cat.name}`}
                        >
                          <Trash2 size={50} className="text-red-800" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Users;
