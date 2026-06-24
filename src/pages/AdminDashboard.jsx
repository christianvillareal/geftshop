import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { fetchProducts } from '../services/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetchProducts(),
          fetch('https://geftshop-backend.onrender.com/api/orders').then(res => res.json())
        ]);
        setProducts(productsRes);
        setOrders(ordersRes);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="space-y-6">Loading dashboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  // --- Weekly trends (last 7 days) ---
  const last7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };
  const dateLabels = last7Days();

  const dailyRevenue = {};
  const dailyOrderCount = {};
  dateLabels.forEach(day => {
    dailyRevenue[day] = 0;
    dailyOrderCount[day] = 0;
  });

  orders.forEach(order => {
    const day = order.createdAt?.slice(0, 10);
    if (day && dailyRevenue[day] !== undefined) {
      dailyRevenue[day] += order.total || 0;
      dailyOrderCount[day] += 1;
    }
  });

  const chartData = dateLabels.map(day => ({
    day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: dailyRevenue[day],
    orders: dailyOrderCount[day],
  }));

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const statusColors = {
    pending: 'text-yellow-600 bg-yellow-100',
    approved: 'text-green-600 bg-green-100',
    shipped: 'text-blue-600 bg-blue-100',
    cancelled: 'text-red-600 bg-red-100',
  };

  // Dummy trends – you can calculate real week-over-week later
  const revenueTrend = '+12.5%';
  const ordersTrend = '+8.2%';
  const productsTrend = '+3%';
  const outOfStockTrend = '-5%';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-2xl shadow-sm p-6 transition hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Products</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalProducts}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {productsTrend}
              </p>
            </div>
            <div className="p-3 bg-lime-50 rounded-xl">
              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6 transition hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalOrders}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {ordersTrend}
              </p>
            </div>
            <div className="p-3 bg-lime-50 rounded-xl">
              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl shadow-sm p-6 transition hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Revenue</p>
              <p className="text-3xl font-bold text-red-600 mt-1">₱{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {revenueTrend}
              </p>
            </div>
            <div className="p-3 bg-lime-50 rounded-xl">
              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-2xl shadow-sm p-6 transition hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{outOfStockCount}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {outOfStockTrend}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">Revenue Trend (Last 7 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₱${value}`} />
              <Tooltip formatter={(value) => [`₱${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#84cc16" fill="url(#revenueGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">Daily Orders (Last 7 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#84cc16" radius={[4,4,0,0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-sm text-lime-600 hover:underline" onClick={() => window.location.href = '/geftshop/#/admin/orders/'}>
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₱{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
