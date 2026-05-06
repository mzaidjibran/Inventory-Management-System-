import UserModel from "../models/UserModel.js";
import RefreshToken from "../models/refreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt, { compare } from "bcrypt";

const normalizeUserImage = (image) => {
  if (!image) return "";
  return image.startsWith("/image/")
    ? image
    : `/image/${image.split(/[\\/]/).pop()}`;
};

const toSafeUser = (user) => {
  if (!user) return null;
  const raw = user.toObject ? user.toObject() : user;
  return {
    ...raw,
    image: normalizeUserImage(raw.image),
  };
};
//sing up controller
export const SignUp = async (request, response) => {
  try {
    const { Name, email, password } = request.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      Name: Name,
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
//refresh controler
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

export const getMyProfile = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    response.status(200).json({
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

export const updateMyProfile = async (request, response) => {
  try {
    const updateData = { ...request.body };
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
        message: "User not found",
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      message: "Profile updated successfully",
      data: toSafeUser(updatedUser),
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};
// export const resetpassword = async (request, response) => {
//   const { token, newPassword } = request.body;
//   const tokens = await passwordResetToken
//     .findOne({ used: false })
//     .papolate("userId");
//   for (const tokenData of tokens) {
//     if (await comparetoken(token, tokenData.tokenhash)) {
//       if (tokenData.attemts >= 5) {
//         return response.status(400).json({
//           message: "too many failed attempts, please request a new token",
//         });
//       }
//       tokenData.attemts++;
//       await tokenData.save();
//       if (tokenData.expiresIn < new Date())
//         return response.status(400).json({
//           message: "token expired, please request a new token",
//         });
//       tokenData.userId.password = await hashpassword(newPassword);
//       await tokenData.userId.save();
//       tokenData.used = true;
//       await tokenData.save();
//       return response.status(200).json({
//         message: "password reset successfully",
//       });
//     }
//   }
//   return response.status(400).json({
//     message: "invalid token",
//   });
// };
// //frogot password controller
// export const forgotpassword = async (request, response) => {
//   const user = await User.findOne({ email: request.body.email });
//   if (!user) {
//     return response.status(404).json({message: "user not found"});
//   }
//   await passwordResetToken.deleteMany({ userId: user._id });
//   const raw genrateresetToken = ();
//   console.log(raw genrateresetToken);
//   await passwordResetToken.create({
//     userId: user._id,
//     tokenhash: await hashtoken(raw),
//     expiresIn: new Date(Date.now() + 60 * 60 * 1000),
//   });
//   await sendResetEmail(user.email, raw);
//   return response.status(200).json({
//     message: "password reset email sent",
//   });
// };
