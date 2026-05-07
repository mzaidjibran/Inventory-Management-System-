const API_BASE = "http://localhost:3000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

const createClient = async (data) => {
  const response = await fetch(`${API_BASE}/api/client`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Create failed: ${response.status}`);
  return response.json();
};

export default createClient;

export const getAllClients = async () => {
  const response = await fetch(`${API_BASE}/api/client`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
  return response.json();
};

export const getSingleClient = async (id) => {
  const response = await fetch(`${API_BASE}/api/client/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Get failed: ${response.status}`);
  return response.json();
};

export const updateClient = async (id, data) => {
  const response = await fetch(`${API_BASE}/api/client/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Update failed: ${response.status}`);
  return response.json();
};

export const deleteClient = async (id) => {
  const response = await fetch(`${API_BASE}/api/client/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
  return response.json();
};
