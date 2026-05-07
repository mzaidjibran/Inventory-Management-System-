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
  return {
    ...safeRaw,
    image: normalizeUserImage(raw.image),
  };
};

export const SignUp = async (request, response) => {
  try {
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
        message: "Email already registered",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      Name,
      email: email.toLowerCase().trim(),
      password: hashpassword,
      role: "user",
    });

    return response.status(201).json({
      success: true,
      message: "Registered successfully",
      data: toSafeUser(newUser),
    });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

export const SignIn = async (request, response) => {
  try {
    const { email, password } = request.body;

    const findUser = await UserModel.findOne({
      email: email?.toLowerCase().trim(),
    });
    if (!findUser) {
      return response.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, findUser.password);
    if (!match) {
      return response.status(401).json({
        success: false,
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
      success: true,
      message: "Login Successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Login failed",
      errorMessage: error.message,
    });
  }
};

export const logOut = async (request, response) => {
  try {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      return response
        .status(400)
        .json({ success: false, message: "Refresh token required" });
    }
    await RefreshToken.deleteOne({ token: refreshToken });
    return response.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

export const refresh = async (request, response) => {
  try {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      return response
        .status(400)
        .json({ success: false, message: "Refresh token required" });
    }

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
    }).populate("userId");
    if (!storedToken) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid refresh token" });
    }

    try {
      jwt.verify(storedToken.token, process.env.JWT_REFRESH_SECRET);
    } catch {
      await RefreshToken.deleteOne({ token: refreshToken });
      return response
        .status(401)
        .json({ success: false, message: "Refresh token expired" });
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    const userRole = storedToken.userId?.role || "user";
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
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    response.status(200).json({ success: true, data: toSafeUser(user) });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

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
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    response.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: toSafeUser(updatedUser),
    });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

export const forgotpassword = async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) {
      return response
        .status(400)
        .json({ success: false, message: "Email zaroori hai" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return response.status(200).json({
        success: true,
        message: "Agar email registered hai toh OTP bhej diya gaya hai",
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
      message: "OTP aapki email pe bhej diya gaya hai",
    });
  } catch (error) {
    console.error("forgotpassword error:", error);
    return response
      .status(500)
      .json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (request, response) => {
  try {
    const { email, otp } = request.body;
    if (!email || !otp) {
      return response
        .status(400)
        .json({ success: false, message: "Email aur OTP zaroori hain" });
    }

    const otpRecord = await OtpModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!otpRecord) {
      return response.status(400).json({
        success: false,
        message: "OTP nahi mila, dobara request karen",
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
      return response
        .status(400)
        .json({ success: false, message: "Galat OTP" });
    }

    const resetToken = jwt.sign(
      { email: email.toLowerCase().trim() },
      process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    await OtpModel.deleteOne({ email });

    return response.status(200).json({
      success: true,
      message: "OTP verified",
      resetToken,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: error.message });
  }
};

export const resetpassword = async (request, response) => {
  try {
    const { resetToken, newPassword } = request.body;
    if (!resetToken || !newPassword) {
      return response.status(400).json({
        success: false,
        message: "resetToken aur newPassword zaroori hain",
      });
    }

    if (newPassword.length < 6) {
      return response.status(400).json({
        success: false,
        message: "Password kam az kam 6 characters ka hona chahiye",
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
        message: "Reset token invalid ya expire ho gaya",
      });
    }

    const user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User nahi mila" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // ✅ Saare refresh tokens delete karo (security: force re-login)
    await RefreshToken.deleteMany({ userId: user._id });

    return response.status(200).json({
      success: true,
      message: "Password reset ho gaya, please login karen",
    });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: error.message });
  }
};
