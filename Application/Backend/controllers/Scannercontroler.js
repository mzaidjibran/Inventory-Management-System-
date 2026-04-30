import ScanSession from "../models/Scannermodal.js";
const createScan = async (request, response) => {
  try {
    const scan = await ScanSession.create(request.body);
    response.status(201).json(scan);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};
export { createScan };
//get all scans
export const getAllScans = async (request, response) => {
  try {
    const scans = await ScanSession.find();
    response.status(200).json({
      success: true,
      error: false,
      message: "Scans fetched successfully",
      data: scans,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching scans",
      data: null,
    });
  }
};
//get scan by id
export const getSingleScan = async (request, response) => {
  try {
    const scan = await ScanSession.findById(request.params.id);
    if (!scan) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Scan not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Scan fetched successfully",
      data: scan,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error fetching scan",
    });
  }
};
//update scan
export const updateScan = async (request, response) => {
  try {
    const updatedScan = await ScanSession.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    if (!updatedScan) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Scan not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Scan updated successfully",
      data: updatedScan,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error updating scan",
    });
  }
};
//delete scanexport const deleteScan = async (request, response) => {
export const deleteScan = async (request, response) => {
  try {
    const deletedScan = await ScanSession.findByIdAndDelete(request.params.id);
    if (!deletedScan) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Scan not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Scan deleted successfully",
      data: deletedScan,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Error deleting scan",
    });
  }
};
