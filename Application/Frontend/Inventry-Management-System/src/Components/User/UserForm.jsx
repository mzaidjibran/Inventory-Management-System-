import React, { useState, useEffect } from "react";
import addUser from "../../Api/UserApi.js"
import { toast } from "react-toastify";
import { isAdmin } from "../../Api/authApi.js";

const UserForm = ({ onSaved, editData, onClearEdit }) => {
    const empty = { User_Name: "", email: "", password: "", role: "employee" };
    const [value, updateValue] = useState(empty);

    useEffect(() => {
        if (editData) {
            updateValue({
                User_Name: editData.User_Name || "",
                email: editData.email || "",
                password: "",
                role: editData.role || "employee"
            });
        } else {
            updateValue(empty);
        }
    }, [editData]);

    function handleChange(field) {
        return (e) => updateValue(prev => ({ ...prev, [field]: e.target.value }));
    }

    async function SaveUser(e) {
        e.preventDefault();
        
        // Check if user is admin
        if (!isAdmin()) {
            toast.error("Only admins can add or edit users");
            return;
        }
        
        try {
            // Validate required fields
            if (!value.User_Name || value.User_Name.trim() === "") {
                toast.error("User Name is required");
                return;
            }
            if (!value.email || value.email.trim() === "") {
                toast.error("Email is required");
                return;
            }
            if (!editData && (!value.password || value.password.trim() === "")) {
                toast.error("Password is required");
                return;
            }
            if (!value.role) {
                toast.error("Role is required");
                return;
            }

            if (editData) {
                const { updateUser } = await import("../../Api/UserApi.js");
                await updateUser(editData._id, value);
                toast.success("User updated successfully");
            } else {
                await addUser(value);
                toast.success("User added successfully");
            }
            updateValue(empty);
            onSaved && onSaved();
            onClearEdit && onClearEdit();
            const modal = document.getElementById("modalDeptForm");
            const bsModal = window.bootstrap?.Modal?.getInstance(modal);
            bsModal?.hide();
        } catch (err) {
            toast.error("Error: " + err.message);
        }
    }

    function handleReset() {
        updateValue(empty);
        onClearEdit && onClearEdit();
    }

    return (
        <div className="modal fade" id="modalDeptForm">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{editData ? "Edit User" : "Add User"}</h5>
                        <button type="button" className="btn btn-sm btn-label-danger btn-icon"
                            data-bs-dismiss="modal" onClick={handleReset}>
                            <i className="mdi mdi-close"></i>
                        </button>
                    </div>
                    <form onSubmit={SaveUser}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">User Name</label>
                                <input className="form-control" type="text"
                                    value={value.User_Name}
                                    onChange={handleChange("User_Name")}
                                    placeholder="Enter User Name"
                                    required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input className="form-control" type="email"
                                    value={value.email}
                                    onChange={handleChange("email")}
                                    placeholder="Enter Email"
                                    required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input className="form-control" type="password"
                                    value={value.password}
                                    onChange={handleChange("password")}
                                    placeholder="Enter Password"
                                    required={!editData} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select className="form-control"
                                    value={value.role}
                                    onChange={handleChange("role")}
                                    required>
                                    <option value="">-- Select Role --</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">
                                {editData ? "Update" : "Submit"}
                            </button>
                            <button type="button" className="btn btn-outline-danger" onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;