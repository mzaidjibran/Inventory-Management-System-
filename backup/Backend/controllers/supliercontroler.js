import Supplier from "../models/Supliermodal.js";

const createsuppliers = async (request, response) => {
  try {
    const supplier = await Supplier.create(request.body);
    response.status(201).json(supplier);
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Supplier email already exists",
      });
    }

    response.status(400).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

export { createsuppliers };

//get all suppliers

export const getAllsuppliers = async (request, response) => {
  try {
    const suppliers = await Supplier.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Suppliers fetched successfully",
      data: suppliers,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching suppliers",
      data: null,
    });
  }
};

//get supplier by id

export const getSingleSupplier = async (request, response) => {
  try {
    const supplier = await Supplier.findById(request.params.id);
    if (!supplier) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Supplier not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Supplier fetched successfully",
      data: supplier,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching supplier",
    });
  }
};

//update supplier

export const updateSupplier = async (request, response) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true },
    );
    if (!updatedSupplier) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Supplier not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Supplier email already exists",
      });
    }

    response.status(500).json({
      success: false,
      error: true,
      message: error.message || "Error updating supplier",
    });
  }
};

//delete supplier

export const deleteSupplier = async (request, response) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(request.params.id);
    if (!deletedSupplier) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Supplier not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Supplier deleted successfully",
      data: deletedSupplier,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting supplier",
    });
  }
};