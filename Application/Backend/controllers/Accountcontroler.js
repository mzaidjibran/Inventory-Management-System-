import UserModel from "../models/UserModel.js";
import RefreshToken from "../models/refreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
//sing up controller
export const SignUp = async (request, response) => {
  try {
    const { User_Name, email, password } = request.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      User_Name,
      email: email.toLowerCase().trim(),
      password: hashpassword,
      role: "user",
    });
    return response.status(201).json({
      success: true,
      message: "Registered successfully",
      data: newUser,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
//sign in controller
export const SignIn = async (request, response) => {
  try {
    const { email, password } = request.body;

    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, findUser.password);
    if (!match) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid credentials",
      });
    }

    const accessToken = await generateAccessToken(findUser._id, findUser.role);
    const refreshToken = await generateRefreshToken(findUser._id);

    await RefreshToken.create({
      userId: findUser._id,
      token: refreshToken,
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return response.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Login failed",
      errorMessage: error.message,
    });
  }
};
//logout controller
export const logOut = async (request, response) => {
  try {
    const { refreshToken } = request.body;

    await RefreshToken.deleteOne({ token: refreshToken });

    return response.status(200).json({
      success: true,
      error: false,
      message: "Logout Successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Logout failed",
      Message: error.message,
    });
  }
};

export const refresh = async (request, response) => {
  try {
    const { refreshToken } = request.body;

    const storedRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    }).populate("userId");
    if (!storedRefreshToken) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "No token",
      });
    }

    jwt.verify(storedRefreshToken.token, process.env.JWT_REFRESH_SECRET);
    await RefreshToken.deleteOne({ token: refreshToken });

    const userRole = storedRefreshToken.userId
      ? storedRefreshToken.userId.role
      : "user";

    const newAccessToken = await generateAccessToken(
      storedRefreshToken.userId._id,
      userRole,
    );
    const newRefreshToken = await generateRefreshToken(
      storedRefreshToken.userId._id,
    );

    await RefreshToken.create({
      userId: storedRefreshToken.userId._id,
      token: newRefreshToken,
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return response.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Login failed",
      Message: error.message,
    });
  }
};
