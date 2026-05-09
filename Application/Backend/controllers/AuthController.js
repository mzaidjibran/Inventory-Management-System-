import UserModel from "../models/UserModel.js";
import RefreshToken from "../models/refreshToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- Helper: Normalize image path ---

const normalizeUserImage = (image) => {
  if (!image) return "";
  return image.startsWith("/image/") ? image : `/image/${image.split(/[\\/]/).pop()}`;
};

// --- Helper: Return user without password ---
const toSafeUser = (user) => {
  if (!user) return null;
  const raw = user.toObject ? user.toObject() : user;
  const { password, ...safeRaw } = raw;
  return { ...safeRaw, image: normalizeUserImage(raw.image) };
};

// SIGN UP: Only employees can sign up

export const SignUp = async (request, response) => {
  try {
    const { Name, email, password, role } = request.body;

    if (!Name || !email || !password) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Name, email and password are required!",
      });
    }

    const userRole = role || "employee";

    if (userRole !== "employee") {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Only Employee LogIn is allowed!",
      });
    }

    const existing = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existing) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "This Email is already registered!",
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
      message: `Employee "${Name}" successfully registered!`,
      data: toSafeUser(newUser),
    });

  } catch (error) {
    response.status(400).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// SIGN IN

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

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid password",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_ACCESS_SECRET || "access_secret_key",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
      { expiresIn: "7d" }
    );

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
    });

    return response.status(200).json({
      success: true,
      error: false,
      message: `Welcome ${user.Name}! (${user.role})`,
      data: {
        user: toSafeUser(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// REFRESH TOKEN

export const RefreshAccessToken = async (request, response) => {
  try {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh_secret_key"
    );

    const tokenRecord = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
    });

    if (!tokenRecord) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid refresh token",
      });
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_ACCESS_SECRET || "access_secret_key",
      { expiresIn: "15m" }
    );

    return response.status(200).json({
      success: true,
      error: false,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    response.status(401).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// LOGOUT

export const LogOut = async (request, response) => {
  try {
    const { refreshToken } = request.body;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "Logged out successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error : true,
      message: error.message,
    });
  }
};

// GET CURRENT USER

export const GetCurrentUser = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);

    if (!user) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      data: toSafeUser(user),
    });

  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// ADMIN-ONLY: Create Employee/Admin

export const AdminCreateUser = async (request, response) => {
  try {
    const { Name, email, password, role } = request.body;

    if (!Name || !email || !password || !role) {
      return response.status(400).json({
        success: false,
        message: "Name, email, password aur role zaroori hain",
      });
    }

    // Sirf employee aur admin allowed hain
    if (!["employee", "admin"].includes(role)) {
      return response.status(400).json({
        success: false,
        message: "Invalid role — sirf employee ya admin allowed hai",
      });
    }

    const existing = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return response.status(400).json({
        success: false,
        message: "Email pehle se exists karta hai",
      });
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
      message: `${role} "${Name}" successfully created`,
      data: toSafeUser(newUser),
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────
// ADMIN-ONLY: Get All Users
// ──────────────────────────────────────────────────────────────────────────
export const AdminGetAllUsers = async (request, response) => {
  try {
    const { role } = request.query;

    let query = {};
    if (role && ["employee", "admin"].includes(role)) {
      query.role = role;
    }

    const users = await UserModel.find(query).select("-password");

    return response.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────
// ADMIN-ONLY: Update User
// ──────────────────────────────────────────────────────────────────────────
export const AdminUpdateUser = async (request, response) => {
  try {
    const { id } = request.params;
    const updateData = { ...request.body };

    if (updateData.password && updateData.password.trim()) {
      updateData.password = await bcrypt.hash(updateData.password.trim(), 10);
    } else {
      delete updateData.password;
    }

    // Sirf employee aur admin allowed hain
    if (updateData.role && !["employee", "admin"].includes(updateData.role)) {
      return response.status(400).json({
        success: false,
        message: "Invalid role — sirf employee ya admin allowed hai",
      });
    }

    const updated = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!updated) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return response.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────
// ADMIN-ONLY: Delete User
// ──────────────────────────────────────────────────────────────────────────
export const AdminDeleteUser = async (request, response) => {
  try {
    const { id } = request.params;

    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return response.status(200).json({
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