const API_BASE = "http://localhost:3000";

// creating supplier

const createSupplier = async (data) => {
  const response = await fetch(`${API_BASE}/api/suplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Create failed: ${response.status}`);
  return response.json();
};
export default createSupplier;

// get all suppliers

export const getAllSuppliers = async () => {
  const response = await fetch(`${API_BASE}/api/suplier`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
  return response.json();
};

// get Single Supplier

export const getSingleSupplier = async (id) => {
  const response = await fetch(`${API_BASE}/api/suplier/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Get failed: ${response.status}`);
  return response.json();
};

// update suppliers

export const updateSuppliers = async (id, data) => {
  const response = await fetch(`${API_BASE}/api/suplier/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Update failed: ${response.status}`);
  return response.json();
};

// delete supplier

export const deleteSupplier = async (id) => {
  const response = await fetch(`${API_BASE}/api/suplier/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
  return response.json();
};
