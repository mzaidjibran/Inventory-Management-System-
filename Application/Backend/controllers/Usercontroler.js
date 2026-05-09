import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

//  Create User (Admin karta hai — DB mein save, login capable) 

export const createUser = async (request, response) => {
  try {
    const { Name, email, password, role, createdBy } = request.body;

    // Required fields check

    if (!Name || !email || !password) {
      return response.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Email already exist check

    const existing = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return response.status(400).json({
        success: false,
        message: "Yeh email already registered hai",
      });
    }

    // Password hash karo

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      Name: Name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "user",
      createdBy: createdBy || "Admin",
    });

    // Password response mein mat bhejo

    const { password: _pw, ...safeUser } = user.toObject();

    return response.status(201).json({
      success: true,
      message: `User "${Name}" successfully create ho gaya. Ab yeh login kar sakta hai.`,
      data: safeUser,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//  Get All Users 

export const getAllusers = async (request, response) => {
  try {
    // Password field exclude karo
    const allusers = await UserModel.find().select("-password");
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

//  Get Single User 

export const getSingleuser = async (request, response) => {
  try {
    const singleuser = await UserModel.findById(request.params.id).select(
      "-password",
    );
    if (!singleuser) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User not found",
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

//  Update User 

export const updatedUser = async (request, response) => {
  try {
    const updateData = { ...request.body };

    // Agar password bheja hai to hash karo, warna update mein mat dalo
    if (updateData.password && updateData.password.trim()) {
      updateData.password = await bcrypt.hash(updateData.password.trim(), 10);
    } else {
      delete updateData.password; // blank password ignore karo
    }

    const updated = await UserModel.findByIdAndUpdate(
      request.params.id,
      updateData,
      { new: true },
    ).select("-password");

    if (!updated) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    response.status(200).json({
      success: true,
      data: updated,
      message: "User updated successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  Delete User 

export const deletedUser = async (request, response) => {
  try {
    const deleted = await UserModel.findByIdAndDelete(request.params.id);
    if (!deleted) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    response.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};