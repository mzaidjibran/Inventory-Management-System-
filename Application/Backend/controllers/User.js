import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const createUser = async (request, response) => {
  try {
    const hashpassword = await bcrypt.hash(request.body.password, 10);
    request.body.password = hashpassword;
    const user = await UserModel.create(request.body);
    response.status(201).json(user);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

export const getAllusers = async (request, response) => {
  try {
    const allusers = await UserModel.findAll();
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
    const singleuser = await UserModel.findByPk(request.params.id);
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
    const updatedUser = await UserModel.findByPk(request.params.id);
    if (!updatedUser) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await updatedUser.update(request.body);
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
    const deletedUser = await UserModel.findByPk(request.params.id);
    if (!deletedUser) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await deletedUser.destroy();
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
