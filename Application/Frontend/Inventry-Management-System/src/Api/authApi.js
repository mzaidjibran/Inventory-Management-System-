const API_BASE = "http://localhost:3000";

// Helper: Decode JWT to extract user info
const decodeToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
};

// SIGNIN
export const signIn = async (email, password) => {
  const response = await fetch(`${API_BASE}/api/account/SignIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");

  // Tokens save karo
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  // Role save karo
  const decoded = decodeToken(data.accessToken);
  if (decoded && decoded.role) {
    localStorage.setItem("userRole", decoded.role);
    localStorage.setItem("userId", decoded._id || decoded.userId || decoded.id);
  }
  return data;
};

// LOGOUT
export const logOut = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  await fetch(`${API_BASE}/api/account/logOut`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
};

// TOKEN REFRESH
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await fetch(`${API_BASE}/api/account/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error("Session expired");
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  // Update role
  const decoded = decodeToken(data.accessToken);
  if (decoded && decoded.role) {
    localStorage.setItem("userRole", decoded.role);
  }
  return data;
};

// Check login hai ya nahi
export const isLoggedIn = () => !!localStorage.getItem("accessToken");

// Get current user role
export const getUserRole = () => localStorage.getItem("userRole") || null;

// Get current user ID
export const getUserId = () => localStorage.getItem("userId") || null;

// Check if user is admin
export const isAdmin = () => getUserRole() === "admin";

// Get logged-in user's profile
export const getMyProfile = async () => {
  const response = await fetch(`${API_BASE}/api/account/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to load profile");
  return data;
};

// Update logged-in user's profile image/info
export const updateMyProfile = async (data) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE}/api/account/me`, {
    method: "PUT",
    headers: isFormData
      ? { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    body: isFormData ? data : JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || "Profile update failed");
  }
  return responseData;
};

// SIGNUP - Public endpoint, NO token required
export const signUp = async (userData) => {
  const response = await fetch(`${API_BASE}/api/account/SignUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Signup failed");
  return data;
};
