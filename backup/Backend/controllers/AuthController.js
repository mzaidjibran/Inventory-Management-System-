import UserModel from "../models/UserModel.js";
import RefreshToken from "../models/refreshToken.js";
import OtpModel from "../models/otpmodal.js";
import { toSafeUser } from "../utils/userHelpers.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signAccess = (userId, role, email) =>
  jwt.sign(
    { userId, role, email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

const signRefresh = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

const saveRefreshToken = (userId, token) =>
  RefreshToken.create({
    userId,
    token,
    expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

// --- Sign Up ---

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

    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "This email is already registered!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      Name: Name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "employee",
      createdBy: "self",
    });

    return response.status(201).json({
      success: true,
      error: false,
      message: "Account created. Please login!",
      data: toSafeUser(newUser),
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Sign In ---

export const SignIn = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Email and password are required!",
      });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid email or password!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid email or password!",
      });
    }

    const accessToken  = signAccess(user._id, user.role, user.email);
    const refreshToken = signRefresh(user._id);
    await saveRefreshToken(user._id, refreshToken);

    return response.status(200).json({
      success: true,
      error: false,
      message: `Welcome ${user.Name}!`,
      data: {
        user: toSafeUser(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Refresh Access Token ---

export const RefreshAccessToken = async (request, response) => {
  try {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Refresh token is required!",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      // Token expired or tampered — clean it up
      await RefreshToken.deleteOne({ token: refreshToken });
      return response.status(401).json({
        success: false,
        error: true,
        message: "Refresh token is invalid or expired!",
      });
    }

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
    }).populate("userId");

    if (!storedToken) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Refresh token not recognised!",
      });
    }

    // --- delete old, issue new pair ---

    await RefreshToken.deleteOne({ token: refreshToken });

    const user           = storedToken.userId;
    const newAccessToken  = signAccess(user._id, user.role, user.email);
    const newRefreshToken = signRefresh(user._id);
    await saveRefreshToken(user._id, newRefreshToken);

    return response.status(200).json({
      success: true,
      error: false,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Logout ---

export const LogOut = async (request, response) => {
  try {
    const { refreshToken } = request.body;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    return response.status(200).json({
      success: true,
      error: false,
      message: "Logged out successfully!",
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Authenticated: Get My Profile ---

export const GetCurrentUser = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);
    if (!user) {
      return response.status(404).json({ success: false, error: true, message: "User not found!" });
    }
    return response.status(200).json({ success: true, error: false, data: toSafeUser(user) });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Update My Profile ---

export const UpdateMyProfile = async (request, response) => {
  try {
    const updateData = { ...request.body };
    delete updateData.password;   // password change has its own flow
    delete updateData.role;       // role cannot be self-changed

    if (request.file) {
      updateData.image = `/image/${request.file.filename}`;
    }

    const updated = await UserModel.findByIdAndUpdate(
      request.userId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return response.status(404).json({ success: false, error: true, message: "User not found!" });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "Profile updated successfully.",
      data: toSafeUser(updated),
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Forgot Password ---

export const ForgotPassword = async (request, response) => {
  try {
    const { email } = request.body;

    // Always return success to avoid email enumeration
    const user = await UserModel.findOne({ email: email?.toLowerCase().trim() });
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await OtpModel.deleteMany({ email: user.email });
      await OtpModel.create({
        email: user.email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
      await sendOtpEmail(user.email, otp);
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "If this email is registered, an OTP has been sent.",
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Verify OTP ---

export const VerifyOtp = async (request, response) => {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({ success: false, error: true, message: "Email and OTP are required!" });
    }

    const otpRecord = await OtpModel.findOne({ email: email.toLowerCase().trim() });

    if (!otpRecord) {
      return response.status(400).json({ success: false, error: true, message: "OTP not found. Please request again!" });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OtpModel.deleteOne({ email });
      return response.status(400).json({ success: false, error: true, message: "OTP has expired. Please request again!" });
    }

    if (otpRecord.otp !== otp) {
      return response.status(400).json({ success: false, error: true, message: "Wrong OTP!" });
    }

    const resetToken = jwt.sign(
      { email: email.toLowerCase().trim() },
      process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    await OtpModel.deleteOne({ email });

    return response.status(200).json({
      success: true,
      error: false,
      message: "OTP verified!",
      resetToken,
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Reset Password ---

export const ResetPassword = async (request, response) => {
  try {
    const { resetToken, newPassword } = request.body;

    if (!resetToken || !newPassword) {
      return response.status(400).json({ success: false, error: true, message: "Reset token and new password are required!" });
    }

    if (newPassword.length < 6) {
      return response.status(400).json({ success: false, error: true, message: "Password must be at least 6 characters!" });
    }

    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET);
    } catch {
      return response.status(400).json({ success: false, error: true, message: "Reset token is invalid or expired!" });
    }

    const user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      return response.status(404).json({ success: false, error: true, message: "User not found!" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await RefreshToken.deleteMany({ userId: user._id }); // force re-login everywhere

    return response.status(200).json({
      success: true,
      error: false,
      message: "Password reset successfully. Please login again!",
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Create User (employee or admin) ---

export const AdminCreateUser = async (request, response) => {
  try {
    const { Name, email, password, role } = request.body;

    if (!Name || !email || !password || !role) {
      return response.status(400).json({ success: false, error: true, message: "Name, email, password and role are required!" });
    }

    if (!["employee", "admin"].includes(role)) {
      return response.status(400).json({ success: false, error: true, message: "Role must be 'employee' or 'admin'!" });
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return response.status(400).json({ success: false, error: true, message: "This email is already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      Name: Name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      createdBy: request.userId,
    });

    return response.status(201).json({
      success: true,
      error: false,
      message: `${role} "${Name}" created successfully!`,
      data: toSafeUser(newUser),
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Admin: Get All Users ---

export const AdminGetAllUsers = async (request, response) => {
  try {
    const { role } = request.query;

    const query = {};
    if (role && ["employee", "admin"].includes(role)) query.role = role;

    const users = await UserModel.find(query).sort({ createdAt: -1 });

    return response.status(200).json({
      success: true,
      error: false,
      total: users.length,
      data: users.map(toSafeUser),
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Admin: Update User ---

export const AdminUpdateUser = async (request, response) => {
  try {
    const { id } = request.params;
    const updateData = { ...request.body };

    if (updateData.role && !["employee", "admin"].includes(updateData.role)) {
      return response.status(400).json({ success: false, error: true, message: "Role must be 'employee' or 'admin'!" });
    }

    if (updateData.password?.trim()) {
      updateData.password = await bcrypt.hash(updateData.password.trim(), 10);
    } else {
      delete updateData.password;
    }

    const updated = await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return response.status(404).json({ success: false, error: true, message: "User not found!" });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "User updated successfully!",
      data: toSafeUser(updated),
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};

// --- Admin: Delete User ---

export const AdminDeleteUser = async (request, response) => {
  try {
    const { id } = request.params;

    const userToDelete = await UserModel.findById(id);
    if (!userToDelete) {
      return response.status(404).json({ success: false, error: true, message: "User not found!" });
    }

    if (userToDelete.role === "admin" && userToDelete._id.toString() === request.userId) {
      return response.status(403).json({ success: false, error: true, message: "You cannot delete your own admin account!" });
    }

    await UserModel.findByIdAndDelete(id);
    await RefreshToken.deleteMany({ userId: id });

    return response.status(200).json({
      success: true,
      error: false,
      message: "User deleted successfully!",
    });
  } catch (error) {
    response.status(500).json({ success: false, error: true, message: error.message });
  }
};