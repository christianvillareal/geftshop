import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { VisaIcon, MasterIcon, AmexIcon, GcashIcon } from '../assets';
import SuccessModal from '../components/SuccessModal';

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getCartTotal();
  const total = subtotal;

  const [selectedPayment, setSelectedPayment] = useState('debit');
  const [cardType, setCardType] = useState('visa');

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
  };

  const validatePhilippineMobile = (phone) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Acceptable patterns:
    // 09171234567 (11 digits starting with 09)
    // 639171234567 (12 digits starting with 639)
    // 9171234567 (10 digits starting with 9)
    if (digits.length === 11 && digits.startsWith('09')) return true;
    if (digits.length === 12 && digits.startsWith('639')) return true;
    if (digits.length === 10 && digits.startsWith('9')) return true;
    return false;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhilippineMobile(customerInfo.phone)) {
      newErrors.phone = 'Please enter a valid Philippine mobile number (e.g., 09171234567, +639171234567, 9171234567)';
    }
    if (!customerInfo.address.trim()) newErrors.address = 'Complete address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const orderData = {
      customer: customerInfo,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        bust: item.bust,
        length: item.length,
        waist: item.waist,
        imageUrl: item.imageUrls?.[0],
        dressCode: item.dressCode,
      })),
      total: total,
      paymentPreference: selectedPayment === 'debit' ? `Debit Card (${cardType})` : 'GCash',
      status: 'pending',
    };

    try {
      const response = await fetch('https://geftshop-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Failed to place order');
      const savedOrder = await response.json();
      setOrderDetails({ orderCode: savedOrder.orderCode, paymentMethod: savedOrder.paymentPreference });
      setShowSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('There was a problem placing your order. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  if (cartItems.length === 0 && !showSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <Link to="/products" className="inline-block bg-lime-600 hover:bg-lime-700 text-white font-medium py-2 px-6 rounded-lg transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-lime-600">Home</Link> &gt;
          <Link to="/products" className="hover:text-lime-600 mx-1">Products</Link> &gt;
          <span className="text-gray-800 font-medium">Cart</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT COLUMN – Cart items (unchanged) */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                <p className="text-sm text-gray-500 mt-1">{itemsCount} Item(s)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                      <img src={item.imageUrls?.[0] || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        Bust: {item.bust || 'N/A'} | Length: {item.length || 'N/A'} | Waist: {item.waist || 'N/A'}
                      </div>
                      <div className="mt-2 font-bold text-red-600">P{item.price.toLocaleString()}</div>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-sm text-gray-600">Qty: 1</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Summary & Customer Info */}
          <div className="lg:w-1/3 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({itemsCount} items)</span>
                  <span>P{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-yellow-600 italic pt-2 border-t">
                  <span>Shipping fee</span>
                  <span>To be calculated</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-red-600 pt-2 border-t">
                  <span>Total (excluding shipping)</span>
                  <span>P{total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Shipping fee will be computed based on your location and order weight. 
                  We will email you the final amount after order confirmation.
                </p>
              </div>
            </div>

            {/* Customer Information with validation errors */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input type="text" name="firstName" placeholder="First Name" value={customerInfo.firstName} onChange={handleCustomerChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input type="text" name="lastName" placeholder="Last Name" value={customerInfo.lastName} onChange={handleCustomerChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <input type="email" name="email" placeholder="Email Address" value={customerInfo.email} onChange={handleCustomerChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input type="tel" name="phone" placeholder="Phone Number (e.g., 09171234567)" value={customerInfo.phone} onChange={handleCustomerChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <textarea rows="2" name="address" placeholder="Complete Address with landmark" value={customerInfo.address} onChange={handleCustomerChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Payment Preference (unchanged) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferred Payment Method</h2>
              <div className="space-y-3">
                {/* Debit Card Option */}
                <div className={`border rounded-lg overflow-hidden cursor-pointer ${selectedPayment === 'debit' ? 'border-lime-500 ring-1 ring-lime-500' : 'border-gray-200'}`} onClick={() => handlePaymentChange('debit')}>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100">
                    <div className="flex-shrink-0">
                      {selectedPayment === 'debit' ? (
                        <div className="w-5 h-5 bg-lime-600 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border border-gray-300 rounded bg-white" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      <span className="font-medium text-gray-800">Debit Card</span>
                    </div>
                  </div>
                  {selectedPayment === 'debit' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <div className="flex flex-wrap gap-4 items-center mb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cardType" value="visa" checked={cardType === 'visa'} onChange={() => setCardType('visa')} className="text-lime-600 focus:ring-lime-500" />
                          <img src={VisaIcon} className="w-10 h-auto" alt="Visa" /><span>Visa</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cardType" value="mastercard" checked={cardType === 'mastercard'} onChange={() => setCardType('mastercard')} className="text-lime-600 focus:ring-lime-500" />
                          <img src={MasterIcon} className="w-10 h-auto" alt="Mastercard" /><span>Mastercard</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cardType" value="amex" checked={cardType === 'amex'} onChange={() => setCardType('amex')} className="text-lime-600 focus:ring-lime-500" />
                          <img src={AmexIcon} className="w-10 h-auto" alt="Amex" /><span>Amex</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">You will receive an email with payment instructions after order confirmation.</p>
                    </div>
                  )}
                </div>

                {/* GCash Option */}
                <div className={`border rounded-lg overflow-hidden cursor-pointer ${selectedPayment === 'gcash' ? 'border-lime-500 ring-1 ring-lime-500' : 'border-gray-200'}`} onClick={() => handlePaymentChange('gcash')}>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100">
                    <div className="flex-shrink-0">
                      {selectedPayment === 'gcash' ? (
                        <div className="w-5 h-5 bg-lime-600 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border border-gray-300 rounded bg-white" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <img src={GcashIcon} className="w-20 h-auto" alt="GCash" />
                      <span className="font-medium text-gray-800">GCash</span>
                    </div>
                  </div>
                  {selectedPayment === 'gcash' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <p className="text-xs text-gray-500">You will receive an email with payment instructions after order confirmation.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button onClick={handlePlaceOrder} disabled={isSubmitting} className="w-full bg-lime-600 hover:bg-lime-700 text-white font-medium py-3 rounded-lg transition shadow-md disabled:opacity-50">
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} orderDetails={orderDetails} />
    </div>
  );
};

export default Cart;