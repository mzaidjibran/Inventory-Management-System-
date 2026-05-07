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

export const signIn = async (email, password) => {
  const response = await fetch(`${API_BASE}/api/account/SignIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  const decoded = decodeToken(data.accessToken);
  if (decoded) {
    localStorage.setItem("userRole", decoded.role || "");
    localStorage.setItem(
      "userId",
      decoded._id || decoded.userId || decoded.id || "",
    );
  }

  // fetch profile for cashier info
  try {
    const profileRes = await fetch(`${API_BASE}/api/account/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
    });
    const profileData = await profileRes.json();
    if (profileRes.ok) {
      const user = profileData.data || profileData;
      localStorage.setItem("userName", user.Name || user.name || "");
      localStorage.setItem("userEmail", user.email || "");
    }
  } catch (e) {
    console.error("Error fetching user profile:", e);
  }

  return data;
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
export const isAdmin = () => getUserRole() === "admin";

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
  const response = await fetch(`${API_BASE}/api/account/SignUp`, {
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
  if (!response.ok) {
    throw new Error(data.message || "Forgot password request failed");
  }

  return data;
};

export const verifyOtp = async (email, otp) => {
  const response = await fetch(`${API_BASE}/api/account/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
};

export const resetPassword = async (resetToken, newPassword) => {
  const response = await fetch(`${API_BASE}/api/account/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetToken, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Password reset failed");
  }

  return data;
};
