import Payout from "../models/Shopexpence.js";
export const createPayout = async (request, response) => {
  try {
    const payout = await Payout.create(request.body);
    response.status(201).json(payout);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

//get all payouts
export const getAllpayouts = async (request, response) => {
  try {
    const payouts = await Payout.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Payouts fetched successfully",
      data: payouts,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching payouts",
      data: null,
    });
  }
};
//get payout by id
export const getSinglePayout = async (request, response) => {
  try {
    const payout = await Payout.findById(request.params.id);
    if (!payout) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Payout not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Payout fetched successfully",
      data: payout,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching payout",
    });
  }
};
//update payout
export const updatePayout = async (request, response) => {
  try {
    const updatedPayout = await Payout.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedPayout) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Payout not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Payout updated successfully",
      data: updatedPayout,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating payout",
    });
  }
};
//delete payout
export const deletePayout = async (request, response) => {
  try {
    const deletedPayout = await Payout.findByIdAndDelete(request.params.id);
    if (!deletedPayout) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Payout not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Payout deleted successfully",
      data: deletedPayout,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting payout",
    });
  }
};
