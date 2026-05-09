const API_BASE = "http://localhost:3000";

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

// ← Yeh export karo — sab jagah use hoga
export const normalizeRole = (r) => {
  if (!r) return null;
  const lower = String(r).toLowerCase();
  if (lower === "admin" || lower === "administrator") return "admin";
  if (lower === "employee") return "employee";
  return "user";
};

export const signIn = async (email, password) => {
  const response = await fetch(`${API_BASE}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");

  localStorage.setItem("accessToken", data.data.accessToken);
  localStorage.setItem("refreshToken", data.data.refreshToken);

  // ← Backend se role directly save karo
  if (data.data.user && data.data.user.role) {
    localStorage.setItem("userRole", data.data.user.role);
  }

  const decoded = decodeToken(data.data.accessToken);
  if (decoded) {
    localStorage.setItem(
      "userId",
      decoded.userId || decoded._id || decoded.id || "",
    );
  }

  // Save user info
  if (data.data.user) {
    localStorage.setItem("user", JSON.stringify(data.data.user));
    localStorage.setItem("userName", data.data.user.Name || "");
    localStorage.setItem("userEmail", data.data.user.email || "");
    localStorage.setItem("userImage", data.data.user.image || "");
  }

  return data.data.user;
};

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
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userImage");
};

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
  const decoded = decodeToken(data.accessToken);
  if (decoded && decoded.role) {
    localStorage.setItem("userRole", decoded.role);
  }
  return data;
};

export const isLoggedIn = () => !!localStorage.getItem("accessToken");
export const getUserRole = () => localStorage.getItem("userRole") || null;
export const getUserId = () => localStorage.getItem("userId") || null;
export const isAdmin = () => normalizeRole(getUserRole()) === "admin";

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
  if (!response.ok)
    throw new Error(responseData.message || "Profile update failed");
  return responseData;
};

export const signUp = async (userData) => {
  const response = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Signup failed");
  return data;
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE}/api/account/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Forgot password request failed");
  return data;
};

export const verifyOtp = async (email, otp) => {
  const response = await fetch(`${API_BASE}/api/account/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "OTP verification failed");
  return data;
};

export const resetPassword = async (resetToken, newPassword) => {
  const response = await fetch(`${API_BASE}/api/account/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetToken, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Password reset failed");
  return data;
};

// Admin: Employee create
export const createEmployeeApi = async (employeeData) => {
  const response = await fetch(`${API_BASE}/api/account/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(employeeData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create employee");
  return data;
};

// Admin: All users fetch
export const getAllUsersApi = async () => {
  const response = await fetch(`${API_BASE}/api/account/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch users");
  return data;
};

// Admin: User delete
export const deleteUserApi = async (id) => {
  const response = await fetch(`${API_BASE}/api/account/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete user");
  return data;
};