import { useEffect, useState } from "react";
import addUser, {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../Api/UserApi.js";

export default function UserHook() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    // userData = { Name, email, password, role: "user" | "admin" }
    const data = await addUser(userData);
    await loadUsers(); // list refresh karo
    return data;
  };

  const editUser = async (id, userData) => {
    const data = await updateUser(id, userData);
    await loadUsers();
    return data;
  };

  const removeUser = async (id) => {
    const data = await deleteUser(id);
    await loadUsers();
    return data;
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, loading, error, loadUsers, createUser, editUser, removeUser };
}
