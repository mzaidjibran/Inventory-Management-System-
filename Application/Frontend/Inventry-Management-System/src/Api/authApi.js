const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const decodeToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

export const normalizeRole = (r) => {
  if (!r) return null;
  const lower = String(r).toLowerCase();
  if (lower === "employee" || lower === "user") return "user";
  if (lower === "administrator" || lower === "admin" || lower === "manager")
    return "admin";
  return lower;
};

// ─── Sign In ───────────────────────────────────────────────────────────────
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

  // Role sirf JWT se lo — UI se nahi
  const decoded = decodeToken(data.accessToken);
  const rawRole = decoded?.role || null;
  const role = normalizeRole(rawRole);
  localStorage.setItem("userRole", role || "user");
  localStorage.setItem(
    "userId",
    decoded?._id || decoded?.userId || decoded?.id || "",
  );

  // Profile cache
  try {
    const profileRes = await fetch(`${API_BASE}/api/account/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
    });
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      const user = profileData.data || profileData;
      localStorage.setItem("userName", user.Name || user.name || "");
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userImage", user.image || "");
    }
  } catch (e) {
    console.error("Profile fetch error:", e);
  }

  return { ...data, normalizedRole: role };
};

// ─── Sign Up ───────────────────────────────────────────────────────────────
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

// ─── Log Out ───────────────────────────────────────────────────────────────
export const logOut = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    await fetch(`${API_BASE}/api/account/logOut`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (e) {
    // Network error ho to bhi logout karo
    console.error("Logout API error:", e);
  }
  // Sab kuch clear karo
};

// ─── Token Refresh ─────────────────────────────────────────────────────────
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
  if (decoded?.role) {
    localStorage.setItem("userRole", normalizeRole(decoded.role));
  }
  return data;
};

// ─── Helpers ───────────────────────────────────────────────────────────────
export const isLoggedIn = () => !!localStorage.getItem("accessToken");
export const getUserRole = () => localStorage.getItem("userRole") || null;
export const getUserId = () => localStorage.getItem("userId") || null;
export const isAdmin = () => normalizeRole(getUserRole()) === "admin";

// ─── Profile ───────────────────────────────────────────────────────────────
export const getMyProfile = async () => {
  const response = await fetch(`${API_BASE}/api/account/me`, {
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

// ─── Forgot / Reset Password ───────────────────────────────────────────────
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
