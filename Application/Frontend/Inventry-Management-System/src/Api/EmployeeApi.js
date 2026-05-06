const API_BASE = "http://localhost:3000";

// creating Employee

const createEmployee = async (data) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE}/api/employee`, {
    method: "POST",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
  return response.json();
};

//update employee

export const updateEmployee = async (id, data) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE}/api/employee/${id}`, {
    method: "PUT",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Update failed: ${response.status}`);
  return response.json();
};

//Delete employee

export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_BASE}/api/employee/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
  return response.json();
};
