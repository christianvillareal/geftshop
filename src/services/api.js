// Use environment variable for local development, fallback to live Render URL.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://geftshop-backend.onrender.com/api';
const PRODUCTS_CACHE_KEY = 'geftshop-products-cache-v1';
const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000;

let productsMemoryCache = null;
let productsCacheTimestamp = 0;
let productsInFlightPromise = null;

const isCacheFresh = (timestamp) => Date.now() - timestamp < PRODUCTS_CACHE_TTL_MS;

const readProductsSessionCache = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(PRODUCTS_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.data || !isCacheFresh(parsed.timestamp)) return null;
    return parsed.data;
  } catch (error) {
    console.warn('Failed to read product cache:', error);
    return null;
  }
};

const writeProductsSessionCache = (data) => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(
      PRODUCTS_CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch (error) {
    console.warn('Failed to write product cache:', error);
  }
};

const clearProductsCache = () => {
  productsMemoryCache = null;
  productsCacheTimestamp = 0;
  productsInFlightPromise = null;

  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(PRODUCTS_CACHE_KEY);
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error ${response.status}`);
  }

  return response.json();
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  return handleResponse(response);
};

// ========== PRODUCT ENDPOINTS ==========
export const fetchProducts = async ({ forceFresh = false } = {}) => {
  if (!forceFresh && productsMemoryCache && isCacheFresh(productsCacheTimestamp)) {
    return productsMemoryCache;
  }

  if (!forceFresh) {
    const sessionCachedProducts = readProductsSessionCache();
    if (sessionCachedProducts) {
      productsMemoryCache = sessionCachedProducts;
      productsCacheTimestamp = Date.now();
      return sessionCachedProducts;
    }
  }

  if (!forceFresh && productsInFlightPromise) {
    return productsInFlightPromise;
  }

  productsInFlightPromise = fetchJson(`${API_BASE_URL}/products`)
    .then((data) => {
      productsMemoryCache = data;
      productsCacheTimestamp = Date.now();
      writeProductsSessionCache(data);
      return data;
    })
    .finally(() => {
      productsInFlightPromise = null;
    });

  return productsInFlightPromise;
};

export const fetchProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return handleResponse(response);
};

export const createProduct = async (formData) => {
  const data = await fetchJson(`${API_BASE_URL}/products`, {
    method: 'POST',
    body: formData,
  });
  clearProductsCache();
  return data;
};

export const updateProduct = async (id, formData) => {
  const data = await fetchJson(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    body: formData,
  });
  clearProductsCache();
  return data;
};

export const deleteProduct = async (id) => {
  const data = await fetchJson(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  clearProductsCache();
  return data;
};
