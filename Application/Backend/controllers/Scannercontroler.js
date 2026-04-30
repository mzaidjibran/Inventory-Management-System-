import EmployeeDesignation from "../models/EmployeeDesignation.js";
const createDesignation = async (request, response) => {
  try {
    const designation = await EmployeeDesignation.create(request.body);
    response.status(201).json(designation);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export { createDesignation };
//get all designation
export const getAllDesignations = async (request, response) => {
  try {
    const designations = await EmployeeDesignation.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Designations fetched successfully",
      data: designations,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching designations",
      data: null,
    });
  }
};
//get designation by id
export const getSingleDesignation = async (request, response) => {
  try {
    const designation = await EmployeeDesignation.findById(request.params.id);
    if (!designation) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Designation not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Designation fetched successfully",
      data: designation,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching designation",
    });
  }
};
//update designation
export const updateDesignation = async (request, response) => {
  try {
    const updatedesignation = await EmployeeDesignation.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedesignation) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Designation not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Designation updated successfully",
      data: updatedesignation,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating designation",
    });
  }
};
//delete designation
export const deleteDesignation = async (request, response) => {
  try {
    const deletedesignation = await EmployeeDesignation.findByIdAndDelete(
      request.params.id,
    );
    if (!deletedesignation) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Designation not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Designation deleted successfully",
      data: deletedesignation,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting designation",
    });
  }
};
