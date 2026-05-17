const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:3000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

const getFormHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// creating Employee

const createEmployee = async (data) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE}/api/employee`, {
    method: "POST",
    headers: isFormData ? getFormHeaders() : getHeaders(),
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Create failed: ${response.status}`);
  return response.json();
};
export default createEmployee;

//get all employees

export const getAllEmployees = async () => {
  const response = await fetch(`${API_BASE}/api/employee`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
  return response.json();
};

//update employee

export const updateEmployee = async (id, data) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE}/api/employee/${id}`, {
    method: "PUT",
    headers: isFormData ? getFormHeaders() : getHeaders(),
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Update failed: ${response.status}`);
  return response.json();
};

//Delete employee

export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_BASE}/api/employee/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
  return response.json();
};
