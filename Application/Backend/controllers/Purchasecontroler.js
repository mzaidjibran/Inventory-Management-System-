import Purchase from "../models/purchasemodal.js";

export const createPurchase = async (request, response) => {
  try {
    const purchase = await Purchase.create(request.body);
    response.status(201).json(purchase);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

//get all purchases
export const getAllPurchases = async (request, response) => {
  try {
    const purchases = await Purchase.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Purchases fetched successfully",
      data: purchases,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching purchases",
      data: null,
    });
  }
};
//get purchase by id
export const getSinglePurchase = async (request, response) => {
  try {
    const purchase = await Purchase.findById(request.params.id);
    if (!purchase) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Purchase not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Purchase fetched successfully",
      data: purchase,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching purchase",
    });
  }
};
//update purchase
export const updatePurchase = async (request, response) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedPurchase) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Purchase not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Purchase updated successfully",
      data: updatedPurchase,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating purchase",
    });
  }
};
//delete purchaseexport const deletePurchase = async (request, response) => {
export const deletePurchase = async (request, response) => {
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(request.params.id);
    if (!deletedPurchase) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Purchase not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Purchase deleted successfully",
      data: deletedPurchase,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting purchase",
    });
  }
};
