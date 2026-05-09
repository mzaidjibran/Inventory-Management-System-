import { useState, useEffect } from "react";

const normalizeRole = (r) => {
  if (!r) return null;
  const lower = String(r).toLowerCase();
  if (lower === "employee" || lower === "user") return "user";
  if (lower === "administrator" || lower === "admin" || lower === "manager")
    return "admin";
  return lower;
};

// localStorage changes ko listen karne wala hook
export const useAuth = () => {
  const [authState, setAuthState] = useState(() => ({
    token: localStorage.getItem("accessToken"),
    userRole: normalizeRole(localStorage.getItem("userRole")),
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    userEmail: localStorage.getItem("userEmail"),
    userImage: localStorage.getItem("userImage"),
  }));

  useEffect(() => {
    // storage event — tab ke bahar ke changes
    const handleStorage = () => {
      setAuthState({
        token: localStorage.getItem("accessToken"),
        userRole: normalizeRole(localStorage.getItem("userRole")),
        userId: localStorage.getItem("userId"),
        userName: localStorage.getItem("userName"),
        userEmail: localStorage.getItem("userEmail"),
        userImage: localStorage.getItem("userImage"),
      });
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    isLoggedIn: !!authState.token,
    token: authState.token,
    userRole: authState.userRole,
    userId: authState.userId,
    userName: authState.userName,
    userEmail: authState.userEmail,
    userImage: authState.userImage,
    isAdmin: authState.userRole === "admin",
    isUser: authState.userRole === "user",
  };
};
