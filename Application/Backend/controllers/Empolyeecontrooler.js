import { Employee } from "../models/index.js";
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
//get all employee
export const getAllEmployees = async (request, response) => {
  try {
    const employees = await Employee.find();
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
//get employee by id
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
//update employee
export const updateEmployee = async (request, response) => {
  try {
    const updateData = { ...request.body };
    if (request.file) {
      updateData.profileImage = request.file.path;
    }
    const updateemployee = await Employee.findByIdAndUpdate(
      request.params.id,
      updateData,
      { new: true, runValidators: true },
    );
    if (!updateemployee) {
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
      data: updateemployee,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating employee",
    });
  }
};
//delete employee
export const deleteEmployee = async (request, response) => {
  try {
    const deleteemployee = await Employee.findByIdAndDelete(request.params.id);
    if (!deleteemployee) {
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
      data: deleteemployee,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting employee",
    });
  }
};
