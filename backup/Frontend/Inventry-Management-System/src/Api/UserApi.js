const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const addUser = async (data) => {
  const response = await fetch(`${API_BASE}/api/user/createUser`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Create failed: ${response.status}`);
  }
  return response.json();
};
export default addUser;

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE}/api/user/getAllusers`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
  return response.json();
};

export const updateUser = async (id, data) => {
  const response = await fetch(`${API_BASE}/api/user/updateuser/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Update failed: ${response.status}`);
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE}/api/user/deleteuser/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Delete failed: ${response.status}`);
  }
  return response.json();
};