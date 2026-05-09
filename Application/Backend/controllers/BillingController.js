import BillingModel from "../models/Bilingmodal.js";
import UserModel from "../models/UserModel.js";

// ACCESS: Admin + Employee

// Create Billing Record (Admin/Employee)

export const createBilling = async (request, response) => {
  try {
    const billingData = request.body;

    // Validate required fields

    if (!billingData.amount || !billingData.billDate) {
      return response.status(400).json({
        success: false,
        message: "Amount aur billDate zaroori hain",
      });
    }

    const newBilling = await BillingModel.create({
      ...billingData,
      createdBy: request.userId,
    });

    return response.status(201).json({
      success: true,
      message: "Billing record created successfully",
      data: newBilling,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Billing Records

export const getAllBilling = async (request, response) => {
  try {
    const billings = await BillingModel.find();

    return response.status(200).json({
      success: true,
      total: billings.length,
      data: billings,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Billing Record

export const getSingleBilling = async (request, response) => {
  try {
    const { id } = request.params;

    const billing = await BillingModel.findById(id);
    if (!billing) {
      return response.status(404).json({
        success: false,
        message: "Billing record not found",
      });
    }

    return response.status(200).json({
      success: true,
      data: billing,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Billing Record (Admin/Employee)

export const updateBilling = async (request, response) => {
  try {
    const { id } = request.params;
    const updateData = request.body;

    const updated = await BillingModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return response.status(404).json({
        success: false,
        message: "Billing record not found",
      });
    }

    return response.status(200).json({
      success: true,
      message: "Billing record updated successfully",
      data: updated,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Billing Record (Admin/Employee)

export const deleteBilling = async (request, response) => {
  try {
    const { id } = request.params;

    const deleted = await BillingModel.findByIdAndDelete(id);
    if (!deleted) {
      return response.status(404).json({
        success: false,
        message: "Billing record not found",
      });
    }

    return response.status(200).json({
      success: true,
      message: "Billing record deleted successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Billing Report/Summary (Admin/Employee)

export const getBillingReport = async (request, response) => {
  try {
    const { startDate, endDate } = request.query;

    let query = {};
    if (startDate || endDate) {
      query.billDate = {};
      if (startDate) query.billDate.$gte = new Date(startDate);
      if (endDate) query.billDate.$lte = new Date(endDate);
    }

    const billings = await BillingModel.find(query);
    const totalAmount = billings.reduce((sum, bill) => sum + (bill.amount || 0), 0);

    return response.status(200).json({
      success: true,
      total: billings.length,
      totalAmount,
      data: billings,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};