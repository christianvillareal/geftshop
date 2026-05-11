import React from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { products as mockProducts } from '../data/products';
import { allOrders as mockOrders } from './Orders'; // adjust import

// Mock orders data (replace with your real data later)
const orders = [
  { id: 1, orderCode: '#1001001', total: 400, status: 'Pending', date: '2026-01-02' },
  { id: 2, orderCode: '#1001002', total: 400, status: 'Approved', date: '2026-01-02' },
  { id: 3, orderCode: '#1001003', total: 350, status: 'Rejected', date: '2026-01-03' },
  { id: 4, orderCode: '#1001004', total: 780, status: 'Pending', date: '2026-01-04' },
  { id: 5, orderCode: '#1001005', total: 200, status: 'Completed', date: '2026-01-05' },
  { id: 6, orderCode: '#1001006', total: 520, status: 'Pending', date: '2026-01-05' },
  { id: 7, orderCode: '#1001007', total: 610, status: 'Approved', date: '2026-01-06' },
  { id: 8, orderCode: '#1001008', total: 290, status: 'Completed', date: '2026-01-07' },
  { id: 9, orderCode: '#1001009', total: 920, status: 'Completed', date: '2026-01-08' },
  { id: 10, orderCode: '#1001010', total: 450, status: 'Pending', date: '2026-01-08' },
];

// Generate daily revenue for last 7 days (mock realistic data)
const generateDailyRevenue = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    revenue: Math.floor(Math.random() * 1000) + 200, // random 200-1200
    orders: Math.floor(Math.random() * 15) + 3,
  }));
};

const dailyData = generateDailyRevenue();

const getLowStockCount = (products) => products.filter(p => p.stock <= 5).length;

const AdminDashboard = () => {
  const products = mockProducts || [];
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = getLowStockCount(products);

  // Trend percentages (mock, replace with real logic)
  const revenueTrend = '+12.5%';
  const ordersTrend = '+8.2%';
  const productsTrend = '+3%';
  const lowStockTrend = '-5%';

  const statusColors = {
    Pending: 'text-yellow-600 bg-yellow-100',
    Approved: 'text-green-600 bg-green-100',
    Rejected: 'text-red-600 bg-red-100',
    Completed: 'text-blue-600 bg-blue-100',
  };

  const recentOrders = [...orders].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,4);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Modern Minimal Cards */}
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

        {/* Low Stock */}
        <div className="bg-white rounded-2xl shadow-sm p-6 transition hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">{lowStockCount}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {lowStockTrend}
              </p>
            </div>
            <div className="p-3 bg-lime-50 rounded-xl">
              <svg className="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section – Revenue & Orders Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">Revenue Trend (Last 7 Days)</h3>
            <select className="text-sm border-gray-300 rounded-md px-2 py-1">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyData}>
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

        {/* Orders Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">Daily Orders</h3>
            <select className="text-sm border-gray-300 rounded-md px-2 py-1">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
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
          <button className="text-sm text-lime-600 hover:underline">View All</button>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">P{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
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