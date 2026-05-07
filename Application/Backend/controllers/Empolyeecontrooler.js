import Employee from "../models/Empolyeemodal.js";
import path from "path";

function normalizePayload(body, file) {
  const data = { ...body };
  if (data.Name) {
  const parts = String(data.Name || "").trim().split(/\s+/);
  data.firstName = parts[0] || "";
  data.lastName = parts.slice(1).join(" ") || parts[0] || "";
  delete data.Name;
}
  if (data.cnic && !data.CNIC) {
    data.CNIC = data.cnic;
    delete data.cnic;
  }
  if (data.dateofBirth && !data.dateOfBirth) {
    data.dateOfBirth = data.dateofBirth;
    delete data.dateofBirth;
  }
  if (data.dateOfJoining && !data.dateOfJoining) {
  }
  if (data.gender && typeof data.gender === "string") {
    const g = data.gender.toLowerCase();
    if (g === "male") data.gender = "Male";
    else if (g === "female") data.gender = "Female";
    else data.gender = "Other";
  }
  // normalize status
  if (data.status && typeof data.status === "string") {
    const s = data.status.toLowerCase();
    if (s === "active") data.status = "Active";
    else if (s === "inactive") data.status = "Inactive";
    else if (s === "terminated") data.status = "Terminated";
    else if (s === "leave" || s === "on leave") data.status = "On Leave";
  }
  if (file) data.profileImage = `/image/${file.filename}`;
  return data;
}

function transformEmployeeDoc(doc) {
  if (!doc) return doc;
  // if doc is a mongoose document, use _doc to avoid prototypes
  const raw = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...raw,
    // keep original model fields but also add keys expected by frontend
    Name: `${raw.firstName || ""} ${raw.lastName || ""}`.trim(),
    cnic: raw.CNIC || raw.cnic || "",
    dateofBirth: raw.dateOfBirth || raw.dateofBirth || null,
    dateOfJoining: raw.dateOfJoining || raw.dateOfJoining || null,
    profileImage: raw.profileImage
      ? raw.profileImage.startsWith("/image/")
        ? raw.profileImage
        : `/image/${path.basename(raw.profileImage)}`
      : "",
  };
}

export const createEmployee = async (request, response) => {
  try {
    const employeeData = normalizePayload(request.body, request.file);
    const employee = await Employee.create(employeeData);
    response.status(201).json(transformEmployeeDoc(employee));
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};



// Get all employees
export const getAllEmployees = async (request, response) => {
  try {
    const employees = await Employee.find();
    const mapped = employees.map(transformEmployeeDoc);
    response.status(200).json({
      success: true,
      error: false,
      message: "Employees fetched successfully",
      data: mapped,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching employees",
      data: null,
    });
  }
};

// Get employee by id
export const getSingleEmployee = async (request, response) => {
  try {
    const employee = await Employee.findById(request.params.id);
    if (!employee) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Employee not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Employee fetched successfully",
      data: transformEmployeeDoc(employee),
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching employee",
    });
  }
};

// Update employee
export const updateEmployee = async (request, response) => {
  try {
    const updateData = normalizePayload(request.body, request.file);
    const updatedEmployee = await Employee.findByIdAndUpdate(
      request.params.id,
      updateData,
      {
        new: true,
      },
    );
    if (!updatedEmployee) {
      return response
        .status(404)
        .json({ success: false, error: true, message: "Employee not found" });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Employee updated successfully",
      data: transformEmployeeDoc(updatedEmployee),
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating employee",
    });
  }
};

// Delete employee
export const deleteEmployee = async (request, response) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(request.params.id);
    if (!deletedEmployee) {
      return response
        .status(404)
        .json({ success: false, error: true, message: "Employee not found" });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Employee deleted successfully",
      data: transformEmployeeDoc(deletedEmployee),
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting employee",
    });
  }
};
