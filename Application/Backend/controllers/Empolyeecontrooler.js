import Employee from "../models/Empolyeemodal.js";

const createEmployee = async (request, response) => {
  try {
    const employeeData = {
      ...request.body,
      profileImage: request.file ? request.file.path : "",
    };
    const employee = await Employee.create(employeeData);
    response.status(201).json(employee);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

export { createEmployee };

// Get all employees
export const getAllEmployees = async (request, response) => {
  try {
    const employees = await Employee.find()
      .populate("department", "name")
      .populate("designation", "title")
      .populate("shift", "name")
      .populate("user", "User_Name email");
    response.status(200).json({
      success: true,
      error: false,
      message: "Employees fetched successfully",
      data: employees,
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
    const employee = await Employee.findById(request.params.id)
      .populate("department", "name")
      .populate("designation", "title")
      .populate("shift", "name")
      .populate("user", "User_Name email");
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
      data: employee,
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
    const updateData = { ...request.body };
    if (request.file) {
      updateData.profileImage = request.file.path;
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      request.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("department", "name")
      .populate("designation", "title")
      .populate("shift", "name")
      .populate("user", "User_Name email");
    if (!updatedEmployee) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Employee not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Employee updated successfully",
      data: updatedEmployee,
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
      return response.status(404).json({
        success: false,
        error: true,
        message: "Employee not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Employee deleted successfully",
      data: deletedEmployee,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting employee",
    });
  }
};
