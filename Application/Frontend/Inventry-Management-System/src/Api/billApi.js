const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000";

const getToken = () => localStorage.getItem("accessToken");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const searchProductByBarcode = async (barcode) => {
  const response = await fetch(
    `${API_BASE}/api/product/search/barcode?barcode=${encodeURIComponent(barcode)}`,
    { method: "GET", headers: getHeaders() },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Product not found");
  return data;
};

export const getAllProducts = async () => {
  const response = await fetch(`${API_BASE}/api/product`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch products");
  return data;
};

export const createScanSession = async () => {
  const response = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create session");
  return data;
};

export const addProductToScan = async (sessionId, barcode, quantity = 1) => {
  const response = await fetch(`${API_BASE}/api/scan/${sessionId}/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ sessionId, barcode, quantity }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to add product");
  return data;
};

export const finalizeBill = async (sessionId, payload) => {
  const response = await fetch(`${API_BASE}/api/scan/${sessionId}/finalize`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to finalize bill");
  return data;
};

export const getAllBillings = async () => {
  const response = await fetch(`${API_BASE}/api/billing`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch bills");
  return data;
};
