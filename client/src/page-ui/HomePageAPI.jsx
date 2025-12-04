import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Package, TrendingUp, Zap } from "lucide-react";
import CustomerNavbar from "../components/CustomerNavbar";
import { productService, categoryService } from "../services";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts({ limit: 8 }),
        categoryService.getCategories()
      ]);

      if (productsRes.success) {
        setFeaturedProducts(productsRes.data.products);
      }

      if (categoriesRes.success) {
        setCategories(categoriesRes.data.categories.slice(0, 8));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
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

  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Chào mừng đến với<br />Tech Store IT4409
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Sản phẩm công nghệ chính hãng • Giá tốt nhất • Giao hàng nhanh
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                <ShoppingCart size={20} />
                Mua sắm ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Package, label: "Sản phẩm", value: "28+" },
              { icon: TrendingUp, label: "Đơn hàng", value: "100+" },
              { icon: Heart, label: "Khách hàng", value: "50+" },
              { icon: Zap, label: "Giao nhanh", value: "24h" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="w-10 h-10 mx-auto text-blue-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {!loading && categories.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            Danh mục sản phẩm
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="group bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
                  {cat.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.description || 'Khám phá ngay'}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-gray-600 text-lg">
              Những sản phẩm công nghệ hot nhất hiện nay
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
                >
                  <Link to={`/product/${product.slug}`} className="block relative">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.images[0] || "https://placehold.co/600x400/3b82f6/ffffff?text=Product"}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400/3b82f6/ffffff?text=Product+Image";
                        }}
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(4.5)</span>
                    </div>

                    <div className="flex items-end justify-between mb-3">
                      <div>
                        {product.discount > 0 ? (
                          <>
                            <p className="text-lg font-bold text-blue-600">
                              {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                            </p>
                            <p className="text-sm text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-blue-600">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>

                      <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-110 shadow-md">
                        <ShoppingCart size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{product.brand}</span>
                      <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Giao hàng nhanh",
              description: "Giao hàng trong 24h tại Hà Nội",
              icon: "🚚"
            },
            {
              title: "Bảo hành chính hãng",
              description: "Cam kết sản phẩm chính hãng 100%",
              icon: "✅"
            },
            {
              title: "Hỗ trợ 24/7",
              description: "Đội ngũ tư vấn nhiệt tình",
              icon: "💬"
            }
          ].map((feature, idx) => (
            <div key={idx} className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bạn đã sẵn sàng mua sắm?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Khám phá hàng ngàn sản phẩm công nghệ với giá tốt nhất
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Đăng ký ngay - Miễn phí
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
