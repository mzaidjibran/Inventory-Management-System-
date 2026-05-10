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
  }, []);

  return { clients, loadClients };
}
