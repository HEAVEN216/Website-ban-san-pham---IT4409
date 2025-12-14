
import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, Eye, Trash2 } from 'lucide-react';
import Papa from 'papaparse';
import { orderService } from '../services';

// ------------------------- Helpers -------------------------
const currency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const groupByDate = (orders) => {
  const map = {};
  orders.forEach(o => {
    const d = new Date(o.date);
    const key = d.toISOString().slice(0,10); // YYYY-MM-DD
    map[key] = (map[key] || 0) + o.amount;
  });
  const arr = Object.keys(map).sort().map(k => ({ date: k, revenue: map[k] }));
  return arr;
};

const breakdownByCategory = (orders) => {
  const map = {};
  orders.forEach(o => {
    o.items.forEach(it => {
      map[it.category] = (map[it.category] || 0) + it.qty * it.unitPrice;
    })
  })
  return Object.keys(map).map(k => ({ name: k, value: map[k] }));
}

// ------------------------- Components -------------------------

const RevenueKPI = ({orders}) => {
  const today = new Date().toISOString().slice(0,10);
  const revenueToday = orders.filter(o => o.date.slice(0,10) === today).reduce((s,a)=>s+a.amount,0);
  const revenueMonth = orders.filter(o => new Date(o.date).getMonth() === new Date().getMonth() && new Date(o.date).getFullYear()===new Date().getFullYear()).reduce((s,a)=>s+a.amount,0);
  const ordersCount = orders.length;
  const avgOrder = ordersCount ? Math.round(orders.reduce((s,a)=>s+a.amount,0)/ordersCount) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">Revenue Today</div>
            <div className="text-2xl text-black font-semibold">{currency(revenueToday)}</div>
          </div>
          <div className="text-green-500 text-sm">+5%</div>
        </div>
        <div className="text-xs text-gray-400 mt-2">So sánh với hôm trước</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">Revenue This Month</div>
            <div className="text-2xl text-black font-semibold">{currency(revenueMonth)}</div>
          </div>
          <div className="text-green-500 text-sm">+12%</div>
        </div>
        <div className="text-xs text-gray-400 mt-2">So sánh với kỳ trước</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">Orders</div>
            <div className="text-2xl text-black font-semibold">{ordersCount}</div>
          </div>
          <div className="text-red-500 text-sm">-2%</div>
        </div>
        <div className="text-xs text-gray-400 mt-2">Trong tháng</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">Avg Order Value</div>
            <div className="text-2xl text-black font-semibold">{currency(avgOrder)}</div>
          </div>
          <div className="text-green-500 text-sm">+3%</div>
        </div>
        <div className="text-xs text-gray-400 mt-2">Giá trị trung bình</div>
      </div>
    </div>
  )
}

const RevenueChart = ({data}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border h-64">
      <h3 className="text-lg text-black font-semibold mb-2">Doanh thu theo ngày</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(v)=>currency(v)} />
          <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const RevenueBreakdown = ({data}) => {
  const COLORS = ['#60a5fa','#f97316','#34d399','#f43f5e','#a78bfa'];
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border h-64">
      <h3 className="text-lg text-black font-semibold mb-2">Phân bổ theo danh mục</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data}
               dataKey="value"
               nameKey="name"
               cx="50%"
               cy="50%"
               outerRadius={70}
               label/>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

const RevenueFilters = ({from, to, setFrom, setTo, categoryOptions, channelOptions, filters, setFilters, onExportCSV}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-col md:flex-row gap-3 items-center">
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600 mr-2">Date</div>
        <DatePicker selected={from} onChange={(d)=>setFrom(d)} selectsStart startDate={from} endDate={to} className="border px-2 py-1 rounded" />
        <span className="px-2">—</span>
        <DatePicker selected={to} onChange={(d)=>setTo(d)} selectsEnd startDate={from} endDate={to} className="border px-2 py-1 rounded" />
      </div>

      <select className="border rounded px-2 py-1" value={filters.category} onChange={(e)=>setFilters(f=>({...f, category: e.target.value}))}>
        <option value="">All Categories</option>
        {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select className="border rounded px-2 py-1" value={filters.channel} onChange={(e)=>setFilters(f=>({...f, channel: e.target.value}))}>
        <option value="">All Channels</option>
        {channelOptions.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <input placeholder="Search order id / customer" className="border rounded px-2 py-1 flex-1" value={filters.q} onChange={(e)=>setFilters(f=>({...f, q: e.target.value}))} />

      <button onClick={onExportCSV} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"><Download size={16}/> Export CSV</button>
    </div>
  )
}

const RevenueTable = ({orders, onView, onDelete}) => {
  const [sortBy, setSortBy] = useState({key: 'date', dir: 'desc'});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const sorted = useMemo(()=>{
    const arr = [...orders];
    arr.sort((a,b)=>{
      if(sortBy.key==='amount') return sortBy.dir==='asc'? a.amount - b.amount : b.amount - a.amount;
      if(sortBy.key==='date') return sortBy.dir==='asc'? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      return 0;
    })
    return arr;
  },[orders, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pageData = sorted.slice((page-1)*perPage, page*perPage);

  useEffect(()=>{ setPage(1); }, [orders, perPage]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg text-black font-semibold">Orders</h3>
        <div className="flex bg-white text-blue items-center gap-2">
          <select value={perPage} onChange={(e)=>setPerPage(Number(e.target.value))} className="border rounded px-2 py-1">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="text-left text-sm text-gray-600 border-b">
            <tr>
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3 cursor-pointer" onClick={()=>setSortBy({key:'date', dir: sortBy.dir==='asc'?'desc':'asc'})}>Date</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Channel</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 cursor-pointer" onClick={()=>setSortBy({key:'amount', dir: sortBy.dir==='asc'?'desc':'asc'})}>Amount</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(o=> (
              <tr key={o.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                <td className="py-2 px-3 text-black font-medium">{o.id}</td>
                <td className="py-2 text-black px-3">{o.customerName}</td>
                <td className="py-2 text-black px-3">{new Date(o.date).toLocaleString('vi-VN')}</td>
                <td className="py-2 text-black px-3">{o.items.map(it=>it.category).filter((v,i,a)=>a.indexOf(v)===i).join(', ')}</td>
                <td className="py-2 text-black px-3">{o.channel}</td>
                <td className="py-2 text-black px-3">{o.status}</td>
                <td className="py-2 text-black px-3">{currency(o.amount)}</td>
                <td className="py-2 text-black px-3">
                  <div className="flex items-center gap-2">
                    <button onClick={()=>onView(o)} aria-label={`View ${o.id}`} className="px-2 py-1 rounded bg-blue-100 text-blue-700"><Eye size={16}/></button>
                    <button onClick={()=>onDelete(o)} aria-label={`Delete ${o.id}`} className="px-2 py-1 rounded bg-red-100 text-red-700"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-sm text-gray-600">Showing {pageData.length} of {sorted.length} orders</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-2 py-1 text-black border rounded">Prev</button>
          <div className="px-3 py-1 text-black border rounded">{page} / {totalPages}</div>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-2 py-1 text-black border rounded">Next</button>
        </div>
      </div>
    </div>
  )
}

const OrderModal = ({order, onClose, onDelete}) => {
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    setLoading(true);
    const t = setTimeout(()=>setLoading(false),300);
    return ()=>clearTimeout(t);
  },[order]);

  if(!order) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 w-11/12 md:w-3/4 max-h-[80vh] overflow-y-auto p-4 animate-fade">
        {loading ? (
          <div className="h-48 flex text-black items-center justify-center">Loading...</div>
        ) : (
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl text-black font-semibold">Order {order.id}</h3>
                <div className="text-sm text-gray-500">{order.customerName} • {new Date(order.date).toLocaleString('vi-VN')}</div>
              </div>
              <div className="flex text-black items-center gap-2">
                <button onClick={()=>{ if(window.confirm('Xác nhận xóa order?')) onDelete(order) }} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                <button onClick={onClose} className="px-3 py-1 bg-gray-100 rounded">Close</button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-black">Items</h4>
              <div className="mt-2 space-y-2">
                {order.items.map((it, idx)=> (
                  <div key={idx} className="flex justify-between border p-2 rounded">
                    <div>
                      <div className="font-medium text-black">{it.name}</div>
                      <div className="text-xs text-gray-500">{it.category} • qty: {it.qty}</div>
                    </div>
                    <div className="text-center text-black">{currency(it.unitPrice * it.qty)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right text-black font-semibold">Total: {currency(order.amount)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ------------------------- Main Component -------------------------

export default function Income(){
  const [orders, setOrders] = useState([]);
  const [from, setFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate()-30); return d; });
  const [to, setTo] = useState(new Date());
  const [filters, setFilters] = useState({ category: '', channel: '', q: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy orders với limit hợp lệ (max 100 theo validator)
      const response = await orderService.getAdminOrders({
        limit: 100
      });
      
      console.log('API Response:', response);
      
      if (response.success && response.data?.orders) {
        // Transform API data to match component format
        const transformedOrders = response.data.orders.map(order => ({
          id: order.orderNumber || order._id,
          _id: order._id,
          customerName: order.user?.fullName || 'Khách hàng',
          date: order.createdAt,
          channel: order.paymentMethod === 'COD' ? 'COD' : 'Online',
          status: order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Pending',
          paymentStatus: order.paymentStatus,
          items: (order.items || []).map(item => ({
            name: item.product?.name || 'Sản phẩm',
            category: item.product?.category?.name || 'Chưa phân loại',
            qty: item.quantity,
            unitPrice: item.price
          })),
          amount: order.totalAmount || 0
        }));
        setOrders(transformedOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Không thể tải dữ liệu đơn hàng: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [from, to]);

  const filtered = useMemo(()=>{
    return orders.filter(o=>{
      const d = new Date(o.date);
      if(d < new Date(from.setHours(0,0,0,0)) || d > new Date(to.setHours(23,59,59,999))) return false;
      if(filters.category){
        const cats = o.items.map(i=>i.category);
        if(!cats.includes(filters.category)) return false;
      }
      if(filters.channel && o.channel !== filters.channel) return false;
      if(filters.q){
        const q = filters.q.toLowerCase();
        if(!o.id.toLowerCase().includes(q) && !o.customerName.toLowerCase().includes(q)) return false;
      }
      return true;
    })
  },[orders, from, to, filters]);

  const chartData = useMemo(()=> groupByDate(filtered), [filtered]);
  const breakdown = useMemo(()=> breakdownByCategory(filtered), [filtered]);

  const categoryOptions = useMemo(()=>{
    const s = new Set();
    orders.forEach(o=> o.items.forEach(it=> s.add(it.category)));
    return Array.from(s);
  },[orders]);

  const channelOptions = useMemo(()=> Array.from(new Set(orders.map(o=>o.channel))), [orders]);

  const handleExportCSV = () => {
    const data = filtered.map(o=> ({ id: o.id, customer: o.customerName, date: o.date, channel: o.channel, status: o.status, amount: o.amount }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleView = (o) => setSelectedOrder(o);
  const handleCloseModal = () => setSelectedOrder(null);

  const handleDelete = (order) => {
    // delete order from list
    setOrders(prev => prev.filter(p=>p.id !== order.id));
    setSelectedOrder(null);
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Thống kê doanh thu</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Thống kê doanh thu</h2>

      <RevenueKPI orders={orders} />

      <RevenueFilters from={from} to={to} setFrom={setFrom} setTo={setTo} categoryOptions={categoryOptions} channelOptions={channelOptions} filters={filters} setFilters={setFilters} onExportCSV={handleExportCSV} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white p-6 rounded shadow-sm border h-64 flex items-center justify-center">Loading chart...</div>
          ) : (
            <RevenueChart data={chartData} />
          )}
        </div>

        <div>
          {loading ? (
            <div className="bg-white p-6 rounded shadow-sm border h-64 flex items-center justify-center">Loading breakdown...</div>
          ) : (
            <RevenueBreakdown data={breakdown} />
          )}
        </div>
      </div>

      <RevenueTable orders={filtered} onView={handleView} onDelete={(o)=>{ if(window.confirm('Xác nhận xóa review?')) { setOrders(prev=> prev.filter(p=>p.id!==o.id)) } }} />

      {selectedOrder && <OrderModal order={selectedOrder} onClose={handleCloseModal} onDelete={handleDelete} />}
    </div>
  )
}

