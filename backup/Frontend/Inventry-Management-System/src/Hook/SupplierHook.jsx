import { useEffect, useState } from "react";
import { getAllSuppliers } from "../Api/supplier.js";

const SupplierHook = () => {
  const [suppliers, setSuppliers] = useState([]);

  const loadSuppliers = async () => {
    try {
      const data = await getAllSuppliers();
      setSuppliers(data.data || []);
    } catch (error) {
      console.error("Error loading suppliers:", error);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  return { suppliers, loadSuppliers };
};

export default SupplierHook;
