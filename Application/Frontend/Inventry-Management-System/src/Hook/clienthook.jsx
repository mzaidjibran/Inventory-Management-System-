import { useEffect, useState } from "react";
import { getAllClients } from "../Api/client.js";

export default function ClientHook() {
  const [clients, setClients] = useState([]);

  const loadClients = async () => {
    try {
      const data = await getAllClients();

      setClients(data.data || []);
    } catch (error) {
      console.error("Error loading clients:", error);
      setClients([]);
    }
  };

  useEffect(() => {
    loadClients();
    // Auto-refresh customer list every 2 seconds (faster detection)
    const interval = setInterval(loadClients, 2000);
    return () => clearInterval(interval);
  }, []);

  return { clients, loadClients };
}
