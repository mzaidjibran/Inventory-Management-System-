import Billing from "../models/Bilingmodal.js";
const createbilling = async (request, response) => {
  try {
    const billing = await Billing.create(request.body);
    response.status(201).json(billing);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export { createbilling };
//get all billings
export const getAllbillings = async (request, response) => {
  try {
    const billings = await Billing.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Billings fetched successfully",
      data: billings,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching billings",
      data: null,
    });
  }
};
//get billing by id
export const getSingleBilling = async (request, response) => {
  try {
    const billing = await Billing.findById(request.params.id);
    if (!billing) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Billing not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Billing fetched successfully",
      data: billing,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching billing",
    });
  }
};
//update billing
export const updateBilling = async (request, response) => {
  try {
    const updatedBilling = await Billing.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedBilling) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Billing not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Billing updated successfully",
      data: updatedBilling,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating billing",
    });
  }
};
//delete billing
export const deleteBilling = async (request, response) => {
  try {
    const deletedBilling = await Billing.findByIdAndDelete(request.params.id);
    if (!deletedBilling) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Billing not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Billing deleted successfully",
      data: deletedBilling,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting billing",
    });
  }
};
