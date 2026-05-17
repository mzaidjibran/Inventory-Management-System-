import Supplier from "../models/Supliermodal.js";

const createsuppliers = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: User ID not found",
      });
    }
    const supplier = await Supplier.create({
      ...request.body,
      createdBy: userId,
    });
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
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: User ID not found",
        data: null,
      });
    }
    // Find suppliers created by user OR legacy suppliers without createdBy
    const suppliers = await Supplier.find({
      $or: [
        { createdBy: userId },
        { createdBy: null },
        { createdBy: { $exists: false } },
      ],
    });
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
    const userId = request.userId;
    const supplierId = request.params.id;

    // Verify the supplier belongs to the current user
    const existingSupplier = await Supplier.findById(supplierId);
    if (!existingSupplier) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Supplier not found",
      });
    }

    // Check if user owns this supplier (with backward compatibility)
    if (
      existingSupplier.createdBy &&
      existingSupplier.createdBy.toString() !== userId.toString()
    ) {
      return response.status(403).json({
        success: false,
        error: true,
        message: "Unauthorized: You can only update your own suppliers",
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      { ...request.body, createdBy: userId },
      { new: true, runValidators: true },
    );

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
    const userId = request.userId;
    const supplierId = request.params.id;

    // Verify the supplier belongs to the current user
    const existingSupplier = await Supplier.findById(supplierId);
    if (!existingSupplier) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Supplier not found",
      });
    }

    // Check if user owns this supplier (with backward compatibility)
    if (
      existingSupplier.createdBy &&
      existingSupplier.createdBy.toString() !== userId.toString()
    ) {
      return response.status(403).json({
        success: false,
        error: true,
        message: "Unauthorized: You can only delete your own suppliers",
      });
    }

    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);

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
