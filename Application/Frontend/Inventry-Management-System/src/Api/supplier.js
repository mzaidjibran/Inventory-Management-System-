const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000";

const parseApiError = async (response, fallback) => {
  try {
    const errorData = await response.json();
    if (errorData?.message) {
      throw new Error(errorData.message);
    }
  } catch {
    // Ignore parse failures and use fallback message below.
  }
  throw new Error(fallback);
};

// creating supplier

const createSupplier = async (data) => {
  const response = await fetch(`${API_BASE}/api/suplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    await parseApiError(response, `Create failed: ${response.status}`);
  }
  return response.json();
};
export default createSupplier;

// get all suppliers

export const getAllSuppliers = async () => {
  const response = await fetch(`${API_BASE}/api/suplier`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    await parseApiError(response, `Get all failed: ${response.status}`);
  }
  return response.json();
};

// get Single Supplier

export const getSingleSupplier = async (id) => {
  const response = await fetch(`${API_BASE}/api/suplier/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    await parseApiError(response, `Get failed: ${response.status}`);
  }
  return response.json();
};

// update suppliers

export const updateSuppliers = async (id, data) => {
  const response = await fetch(`${API_BASE}/api/suplier/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    await parseApiError(response, `Update failed: ${response.status}`);
  }
  return response.json();
};

// delete supplier

export const deleteSupplier = async (id) => {
  const response = await fetch(`${API_BASE}/api/suplier/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    await parseApiError(response, `Delete failed: ${response.status}`);
  }
  return response.json();
};
