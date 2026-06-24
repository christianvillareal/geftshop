import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import TestimonialPage from './pages/TestimonialPage';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import AdminLayout from './pages/AdminLayout';
import AdminProducts from './pages/AdminProducts';
import AdminManageProduct from './pages/AdminManageProduct';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Custom hook to get hash path without leading '#'
const useHashPath = () => {
  const [hashPath, setHashPath] = useState('');
  useEffect(() => {
    const updateHash = () => {
      setHashPath(window.location.hash.replace('#', '') || '/');
    };
    window.addEventListener('hashchange', updateHash);
    updateHash();
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);
  return hashPath;
};

function AppContent() {
  const hashPath = useHashPath();
  const isAdminRoute = hashPath.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/testimonialpage" element={<TestimonialPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} /> 

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-products" element={<AdminManageProduct />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
