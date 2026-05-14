import React, { useState, useEffect } from 'react';
import AlertModal from '../components/AlertModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, title: '', message: '', type: 'info' });

  const showAlert = (title, message, type = 'info') => {
    setAlert({ open: true, title, message, type });
  };
  const closeAlert = () => setAlert({ open: false, title: '', message: '', type: 'info' });

  // Define fetchOrders inside useEffect to satisfy dependency
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('https://geftshop-backend.onrender.com/api/orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        showAlert('Error', 'Failed to fetch orders', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // only once on mount

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`https://geftshop-backend.onrender.com/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showAlert('Success', 'Order status updated', 'success');
        // Refresh orders
        const fetchData = await fetch('https://geftshop-backend.onrender.com/api/orders');
        const data = await fetchData.json();
        setOrders(data);
      } else {
        showAlert('Error', 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Failed to update order:', err);
      showAlert('Error', 'Failed to update status', 'error');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`https://geftshop-backend.onrender.com/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showAlert('Success', 'Order deleted', 'success');
        // Refresh orders
        const fetchData = await fetch('https://geftshop-backend.onrender.com/api/orders');
        const data = await fetchData.json();
        setOrders(data);
      } else {
        showAlert('Error', 'Failed to delete order', 'error');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      showAlert('Error', 'Error deleting order', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6">
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
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Order Code</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Dress Code(s)</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Payment Preference</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => {
                const dressCodes = order.items?.map(item => item.dressCode).filter(Boolean).join(', ') || '—';
                return (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openModal(order)}
                        className="text-lime-600 hover:underline font-medium"
                      >
                        {order.orderCode}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      {order.customer.firstName} {order.customer.lastName}<br />
                      <span className="text-xs text-gray-500">{order.customer.email} | {order.customer.phone}</span>
                    </td>
                    <td className="px-4 py-2 text-sm">{dressCodes}</td>
                    <td className="px-4 py-2">₱{order.total.toLocaleString()}</td>
                    <td className="px-4 py-2">{order.paymentPreference || order.paymentMethod}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <select
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        value={order.status}
                        className="border rounded px-2 py-1 text-sm mr-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="shipped">Shipped</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-600 hover:text-red-800 ml-2"
                        title="Delete order"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Order Code</p><p className="font-medium">{selectedOrder.orderCode}</p></div>
                <div><p className="text-sm text-gray-500">Status</p><span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadge(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                <div><p className="text-sm text-gray-500">Payment Preference</p><p>{selectedOrder.paymentPreference || selectedOrder.paymentMethod}</p></div>
                <div><p className="text-sm text-gray-500">Order Date</p><p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p></div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Name:</span> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</div>
                  <div><span className="text-gray-500">Email:</span> {selectedOrder.customer.email}</div>
                  <div><span className="text-gray-500">Phone:</span> {selectedOrder.customer.phone}</div>
                  <div className="md:col-span-2"><span className="text-gray-500">Address:</span> {selectedOrder.customer.address}</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Products Ordered</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.dressCode && <p className="text-xs text-gray-500">Dress Code: {item.dressCode}</p>}
                        <div className="text-xs text-gray-500">
                          Bust: {item.bust || 'N/A'} | Waist: {item.waist || 'N/A'} | Length: {item.length || 'N/A'}
                        </div>
                        <p className="text-xs text-gray-500">Qty: 1</p>
                      </div>
                      <p className="font-semibold text-red-600">₱{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4 pt-2">
                  <p className="text-lg font-bold text-red-600">Total: ₱{selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-6 py-3 flex justify-end border-t">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      <AlertModal isOpen={alert.open} onClose={closeAlert} title={alert.title} message={alert.message} type={alert.type} />
    </div>
  );
};

export default Orders;