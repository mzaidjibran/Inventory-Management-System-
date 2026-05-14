import { useState, useEffect } from "react";

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize from localStorage, default to true
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return { sidebarOpen, setSidebarOpen, toggleSidebar };
};
