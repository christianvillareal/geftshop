import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import maxiDress from '../assets/images/dress.png';

import { VisaIcon } from '../assets';
import { MasterIcon } from '../assets';
import { AmexIcon } from '../assets';
import { GcashIcon } from '../assets';

const Cart = () => {
  // Cart items
  const [cartItems] = useState([
    {
      id: 1,
      name: 'Maxi Dress Floral',
      price: 200,
      quantity: 1,
      bust: '34"',
      length: '34"',
      waist: '34"',
      image: maxiDress,
    },
    {
      id: 2,
      name: 'Maxi Dress Floral',
      price: 200,
      quantity: 1,
      bust: '34"',
      length: '34"',
      waist: '34"',
      image: maxiDress,
    },
    {
      id: 3,
      name: 'Maxi Dress Floral',
      price: 200,
      quantity: 1,
      bust: '34"',
      length: '34"',
      waist: '34"',
      image: maxiDress,
    },
  ]);

  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 300;
  const total = subtotal + shipping;

  const [selectedPayment, setSelectedPayment] = useState('credit');
  const [cardType, setCardType] = useState('visa');

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-lime-600">Home</Link> &gt;
          <Link to="/products" className="hover:text-lime-600 mx-1">Products</Link> &gt;
          <span className="text-gray-800 font-medium">Cart</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT COLUMN */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                <p className="text-sm text-gray-500 mt-1">{itemsCount} Item(s)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        Bust: {item.bust} | Length: {item.length} | Waist: {item.waist} | Qty: {item.quantity}
                      </div>
                      <div className="mt-2 font-bold text-red-600">P{item.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:w-1/3 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Items ({itemsCount})</span>
                  <span>P{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>P{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-red-600 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>P{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="First Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                  <input type="text" placeholder="Last Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                <input type="tel" placeholder="Phone Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500" />
                <textarea rows="2" placeholder="Complete Address with landmark" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"></textarea>
              </div>
            </div>

            {/* Payment Information - Check/Uncheck style */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h2>
              <div className="space-y-3">
                {/* Credit Card Option */}
                <div
                  className={`border rounded-lg overflow-hidden transition cursor-pointer ${
                    selectedPayment === 'credit' ? 'border-lime-500 ring-1 ring-lime-500' : 'border-gray-200'
                  }`}
                  onClick={() => handlePaymentChange('credit')}
                >
                  <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100">
                    {/* Checkbox indicator */}
                    <div className="flex-shrink-0">
                      {selectedPayment === 'credit' ? (
                        <div className="w-5 h-5 bg-lime-600 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border border-gray-300 rounded bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="font-medium text-gray-800">Credit Card</span>
                    </div>
                  </div>
                  {selectedPayment === 'credit' && (
                    <div className="p-4 space-y-4 bg-white border-t border-gray-100">
                      <div className="flex flex-wrap gap-4 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cardType" value="visa" checked={cardType === 'visa'} onChange={() => setCardType('visa')} className="text-lime-600 focus:ring-lime-500" />
                          <img src={VisaIcon} className="w-10 h-auto" alt="Visa" />
                          <span>Visa</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cardType" value="mastercard" checked={cardType === 'mastercard'} onChange={() => setCardType('mastercard')} className="text-lime-600 focus:ring-lime-500" />
                          <img src={MasterIcon} className="w-10 h-auto" alt="Mastercard" />
                          <span>Mastercard</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cardType" value="amex" checked={cardType === 'amex'} onChange={() => setCardType('amex')} className="text-lime-600 focus:ring-lime-500" />
                          <img src={AmexIcon} className="w-10 h-auto" alt="Amex" />
                          <span>Amex</span>
                        </label>
                      </div>
                      <input type="text" placeholder="Card Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="border border-gray-300 rounded-lg px-3 py-2" />
                        <input type="text" placeholder="CVC" className="border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                    </div>
                  )}
                </div>

                {/* GCash Option */}
                <div
                  className={`border rounded-lg overflow-hidden transition cursor-pointer ${
                    selectedPayment === 'gcash' ? 'border-lime-500 ring-1 ring-lime-500' : 'border-gray-200'
                  }`}
                  onClick={() => handlePaymentChange('gcash')}
                >
                  <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100">
                    <div className="flex-shrink-0">
                      {selectedPayment === 'gcash' ? (
                        <div className="w-5 h-5 bg-lime-600 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border border-gray-300 rounded bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <img src={GcashIcon} className="w-20 h-auto" alt="GCash" />
                      <span className="font-medium text-gray-800">GCash</span>
                    </div>
                  </div>
                  {selectedPayment === 'gcash' && (
                    <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                      <input type="text" placeholder="GCash Mobile Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      <p className="text-xs text-gray-500">You will receive a payment request via SMS.</p>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div
                  className={`border rounded-lg overflow-hidden transition cursor-pointer ${
                    selectedPayment === 'cod' ? 'border-lime-500 ring-1 ring-lime-500' : 'border-gray-200'
                  }`}
                  onClick={() => handlePaymentChange('cod')}
                >
                  <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100">
                    <div className="flex-shrink-0">
                      {selectedPayment === 'cod' ? (
                        <div className="w-5 h-5 bg-lime-600 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border border-gray-300 rounded bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
  <path d="M1 3h15v13H1z" />
  <path d="M16 8h4l3 3v5h-7V8z" />
  <circle cx="5.5" cy="18" r="2" />
  <circle cx="18.5" cy="18" r="2" />
  <path d="M3 16h12" />
</svg>
                      <span className="font-medium text-gray-800">Cash on Delivery</span>
                    </div>
                  </div>
                  {selectedPayment === 'cod' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <p className="text-sm text-gray-600">Pay in cash when your order arrives. Additional fee may apply.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button className="w-full bg-lime-600 hover:bg-lime-700 text-white font-medium py-3 rounded-lg transition shadow-md">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;