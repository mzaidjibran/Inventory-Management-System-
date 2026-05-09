import UserModel from "../models/UserModel.js";
import RefreshToken from "../models/refreshToken.js";
import OtpModel from "../models/otpmodal.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const normalizeUserImage = (image) => {
  if (!image) return "";
  return image.startsWith("/image/")
    ? image
    : `/image/${image.split(/[\\/]/).pop()}`;
};

const toSafeUser = (user) => {
  if (!user) return null;
  const raw = user.toObject ? user.toObject() : user;
  const { password, ...safeRaw } = raw;
  return { ...safeRaw, image: normalizeUserImage(raw.image) };
};

// --- Self SignUp — only "employee" role ---

export const SignUp = async (request, response) => {
  try {
    const { Name, email, password } = request.body;

    if (!Name || !email || !password) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Name, email and password are required!",
      });
    }

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Email is already registered!",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      Name,
      email: email.toLowerCase().trim(),
      password: hashpassword,
      role: "employee",
      createdBy: "self",
    });

    return response.status(201).json({
      success: true,
      error: false,
      message: "Account created. Please login!",
      data: toSafeUser(newUser),
    });

  }
  catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
};

// --- SignIn ---

export const SignIn = async (request, response) => {
  try {
    const { email, password } = request.body;

    const findUser = await UserModel.findOne({
      email: email?.toLowerCase().trim(),
    });

    if (!findUser) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Invalid credentials!"
      });
    }

    const match = await bcrypt.compare(password, findUser.password);
    if (!match) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid password!"
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
      success: true,
      error: false,
      message: "Login Successful",
      accessToken,
      refreshToken,
      role: findUser.role, // Send role for frontend
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: "Login failed",
      errorMessage: error.message
    });
  }
};

// --- Logout ---

export const logOut = async (request, response) => {
  try {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Refresh token is required!"
      });
    }
    await RefreshToken.deleteOne({ token: refreshToken });
    return response.status(200).json({
      success: true,
      error: false,
      message: "Logout Successfully!"
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
};

// --- Refresh Token ---

export const refresh = async (request, response) => {
  try {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Refresh token is required"
      });
    }

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
    }).populate("userId");

    if (!storedToken) {
      return response.status(400).json({
        success: false,
        error: false,
        message: "Invalid refresh token!"
      });
    }

    try {
      jwt.verify(storedToken.token, process.env.JWT_REFRESH_SECRET);
    } catch {
      await RefreshToken.deleteOne({ token: refreshToken });
      return response.status(401).json({
        success: false,
        error: true,
        message: "Refresh token expired!"
      });
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    const userRole = storedToken.userId?.role || "employee";
    const newAccessToken = await generateAccessToken(
      storedToken.userId._id,
      userRole,
    );
    const newRefreshToken = await generateRefreshToken(storedToken.userId._id);

    await RefreshToken.create({
      userId: storedToken.userId._id,
      token: newRefreshToken,
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return response.status(200).json({
      success: true,
      error: false,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
};

// --- Get My Profile ---

export const getMyProfile = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User not found!"
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      data: toSafeUser(user)
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
};

// --- Update My Profile ---

export const updateMyProfile = async (request, response) => {
  try {
    const updateData = { ...request.body };
    delete updateData.password;
    delete updateData.role;

    if (request.file) {
      updateData.image = `/image/${request.file.filename}`;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      request.userId,
      updateData,
      { new: true },
    );

    if (!updatedUser) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User not found!"
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      message: "Profile updated successfully.",
      data: toSafeUser(updatedUser),
    });

  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
};

// // ── Admin: Employee banaye ────────────────────────────────────────────────────
export const createEmployeeByAdmin = async (request, response) => {
  try {
    const requestingUser = await UserModel.findById(request.userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return response.status(403).json({
        success: false,
        message: "Sirf admin employee bana sakta hai",
      });
    }

    const { Name, email, password } = request.body;
    if (!Name || !email || !password) {
      return response.status(400).json({
        success: false,
        message: "Name, email aur password zaroori hain",
      });
    }

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: "Email already registered hai",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newEmployee = await UserModel.create({
      Name,
      email: email.toLowerCase().trim(),
      password: hashpassword,
      role: "employee",
      createdBy: "admin",
    });

    return response.status(201).json({
      success: true,
      message: "Employee account ban gaya",
      data: toSafeUser(newEmployee),
    });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// // ── Admin: Employee delete kare ───────────────────────────────────────────────
export const deleteEmployeeByAdmin = async (request, response) => {
  try {
    const requestingUser = await UserModel.findById(request.userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return response.status(403).json({
        success: false,
        message: "Sirf admin delete kar sakta hai",
      });
    }

    const userToDelete = await UserModel.findById(request.params.id);
    if (!userToDelete) {
      return response
        .status(404)
        .json({ success: false, message: "User nahi mila" });
    }

    if (userToDelete.role === "admin") {
      return response.status(403).json({
        success: false,
        message: "Admin ko delete nahi kar sakte",
      });
    }

    await UserModel.findByIdAndDelete(request.params.id);
    await RefreshToken.deleteMany({ userId: request.params.id });

    return response.status(200).json({
      success: true,
      message: "User delete ho gaya",
    });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// ── Admin: Sab users/employees dekhe ─────────────────────────────────────────
export const getAllUsersByAdmin = async (request, response) => {
  try {
    const requestingUser = await UserModel.findById(request.userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return response.status(403).json({
        success: false,
        message: "Sirf admin dekh sakta hai",
      });
    }

    const users = await UserModel.find({ role: { $ne: "admin" } }).sort({
      createdAt: -1,
    });

    return response.status(200).json({
      success: true,
      data: users.map(toSafeUser),
    });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotpassword = async (request, response) => {
  try {
    const { email } = request.body;

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    console.log("USER FOUND:", user ? user.email : "NOT FOUND");

    if (!user) {
      return response.status(200).json({
        success: true,
        error: false,
        message: "OTP sent to registered email!"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.deleteMany({ email: user.email });

    await OtpModel.create({
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(user.email, otp);

    return response.status(200).json({
      success: true,
      error: false,
      message: "OTP sent to email"
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
};

// --- Verify OTP ---

export const verifyOtp = async (request, response) => {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Please enter OTP"
      });
    }

    const otpRecord = await OtpModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!otpRecord) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "OTP not found, request again!",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OtpModel.deleteOne({ email });
      return response.status(400).json({
        success: false,
        message: "OTP expire ho gaya, dobara request karen",
      });
    }

    if (otpRecord.otp !== otp) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Wrong OTP!"
      });
    }

    const resetToken = jwt.sign(
      { email: email.toLowerCase().trim() },
      process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    await OtpModel.deleteOne({ email });

    return response.status(200).json({
      success: true,
      error: false,
      message: "OTP verified",
      resetToken,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
};

// --- Reset Password ---

export const resetpassword = async (request, response) => {
  try {
    const { resetToken, newPassword } = request.body;
    if (!resetToken || !newPassword) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "New password and refresh token are required!",
      });
    }

    if (newPassword.length < 6) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Password should be more than 6 charaters!",
      });
    }

    let payload;
    try {
      payload = jwt.verify(
        resetToken,
        process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET,
      );
    } catch {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Reset token is invalid or expired",
      });
    }

    const user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User not found!"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await RefreshToken.deleteMany({ userId: user._id });

    return response.status(200).json({
      success: true,
      error: false,
      message: "Password reset successfully, Please Re-Login!",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
};