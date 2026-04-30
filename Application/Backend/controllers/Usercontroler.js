import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const createUser = async (request, response) => {
  try {
    const payload = { ...request.body };
    payload.password = await bcrypt.hash(payload.password, 10);
    const user = await UserModel.create(payload);
    response.status(201).json(user);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const getAllusers = async (request, response) => {
  try {
    const allusers = await UserModel.find();
    response.status(200).json({
      success: true,
      error: false,
      data: allusers,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

export const getSingleuser = async (request, response) => {
  try {
    const singleuser = await UserModel.findById(request.params.id);
    if (!singleuser) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "user not found",
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      data: singleuser,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

export const updatedUser = async (request, response) => {
  try {
    const payload = { ...request.body };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      request.params.id,
      payload,
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    response.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletedUser = async (request, response) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(request.params.id);
    if (!deletedUser) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    response.status(200).json({
      success: true,
      data: deletedUser,
      message: "User deleted successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
