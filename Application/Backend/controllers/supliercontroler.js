import Supplier from "../models/Supliermodal.js";
export const createsuplier = async (request, response) => {
  try {
    const suplier = await Suplier.create(request.body);
    response.status(201).json(suplier);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

//get all suppliers
export const getAllsuplier = async (request, response) => {
  try {
    const supliers = await Suplier.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Suppliers fetched successfully",
      data: supliers,
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
export const getSingleSuplier = async (request, response) => {
  try {
    const suplier = await Suplier.findById(request.params.id);
    if (!suplier) {
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
      data: suplier,
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
export const updateSuplier = async (request, response) => {
  try {
    const updatedSuplier = await Suplier.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedSuplier) {
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
      data: updatedSuplier,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating supplier",
    });
  }
};
//delete supplier
export const deleteSuplier = async (request, response) => {
  try {
    const deletedSuplier = await Suplier.findByIdAndDelete(request.params.id);
    if (!deletedSuplier) {
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
      data: deletedSuplier,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting supplier",
    });
  }
};
