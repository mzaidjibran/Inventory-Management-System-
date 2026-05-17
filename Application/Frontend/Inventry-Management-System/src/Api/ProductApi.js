const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

const getFormHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// creating Product

const createProduct = async (data) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE}/api/product`, {
    method: "POST",
    headers: isFormData ? getFormHeaders() : getHeaders(),
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Create failed: ${response.status}`);
  return response.json();
};
export default createProduct;

//get all products

export const getAllProducts = async () => {
  const response = await fetch(`${API_BASE}/api/product`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
  return response.json();
};

//update product

export const updateProduct = async (id, data) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE}/api/product/${id}`, {
    method: "PUT",
    headers: isFormData ? getFormHeaders() : getHeaders(),
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Update failed: ${response.status}`);
  return response.json();
};

//Delete product

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE}/api/product/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
  return response.json();
};
