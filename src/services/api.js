// Use environment variable for local development, fallback to live Render URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://geftshop-backend.onrender.com/api/products';

// Helper to parse responses (your backend returns { products: [...] } for GET)
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error ${response.status}`);
  }
  return response.json(); // directly return the array or single object
};

// ========== PRODUCT ENDPOINTS ==========
export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse(response);
};

export const fetchProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return handleResponse(response);
};

export const createProduct = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    body: formData, // multipart/form-data with image
  });
  return handleResponse(response);
};

export const updateProduct = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};