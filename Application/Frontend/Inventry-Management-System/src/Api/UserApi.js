const API_BASE = "http://localhost:3000";

const getHeaders = () => ({
  "Content-Type": "application/json", // multipart/form-data
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
}); // ← Token added here

// add user

const addUser = async (data) => {
  const response = await fetch(`${API_BASE}/api/user/createUser`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend error response:", errorText);
    throw new Error(`Create failed: ${response.status} - ${errorText}`);
  }
  return response.json();
};
export default addUser;

//get all users

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE}/api/user/getAllusers`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
  return response.json();
};

//update user

export const updateUser = async (id, data) => {
  const response = await fetch(`${API_BASE}/api/user/updateuser/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend error response:", errorText);
    throw new Error(`Update failed: ${response.status} - ${errorText}`);
  }
  return response.json();
};

//Delete user

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE}/api/user/deleteuser/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend error response:", errorText);
    throw new Error(`Delete failed: ${response.status} - ${errorText}`);
  }
  return response.json();
};
