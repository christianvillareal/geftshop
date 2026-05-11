import React, { useState } from 'react';

// Mock orders data
const allOrders = [
  { id: 1, orderCode: '#1001001', total: 400, status: 'Pending', date: 'January 2, 2026' },
  { id: 2, orderCode: '#1001002', total: 400, status: 'Approved', date: 'January 2, 2026' },
  { id: 3, orderCode: '#1001003', total: 400, status: 'Rejected', date: 'January 2, 2026' },
  { id: 4, orderCode: '#1001004', total: 400, status: 'Pending', date: 'January 2, 2026' },
  { id: 5, orderCode: '#1001005', total: 400, status: 'Approved', date: 'January 2, 2026' },
  { id: 6, orderCode: '#1001006', total: 400, status: 'Rejected', date: 'January 2, 2026' },
  { id: 7, orderCode: '#1001007', total: 400, status: 'Completed', date: 'January 2, 2026' },
  { id: 8, orderCode: '#1001008', total: 400, status: 'Completed', date: 'January 2, 2026' },
];

const statusColors = {
  Pending: 'text-yellow-600 bg-yellow-100',
  Approved: 'text-green-600 bg-green-100',
  Rejected: 'text-red-600 bg-red-100',
  Completed: 'text-blue-600 bg-blue-100',
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending Orders' },
    { key: 'rejected', label: 'Rejected Orders' },
    { key: 'completed', label: 'Completed Orders' },
  ];

  // Filter orders based on active tab
  const filteredOrders = allOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'Pending';
    if (activeTab === 'rejected') return order.status === 'Rejected';
    if (activeTab === 'completed') return order.status === 'Completed';
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition rounded-t-lg ${
              activeTab === tab.key
                ? 'text-lime-600 border-b-2 border-lime-600 bg-lime-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">P{order.total.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {order.status === 'Pending' && (
                    <button className="text-lime-600 hover:text-lime-800 font-medium mr-3">Approve</button>
                  )}
                  {order.status !== 'Completed' && order.status !== 'Rejected' && order.status !== 'Approved' && (
                    <button className="text-red-600 hover:text-red-800 font-medium">Reject</button>
                  )}
                  {(order.status === 'Approved' || order.status === 'Completed' || order.status === 'Rejected') && (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;