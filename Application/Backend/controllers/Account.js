import RefreshToken from "../models/refreshToken.js";
import UserModel from "../models/UserModel.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const SignIn = async (request, response) => {
    try {
        const { email, password } = request.body;

        const findUser = await UserModel.findOne({ email });

        if (!findUser) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "Invalid credentials"
            })
        }

        const match = await bcrypt.compare(password, findUser.password);
        if (!match) {
            return response.status(401).json({
                success: false,
                error: true,
                message: "Invalid credentials"
            })
        }

        const accessToken = await generateAccessToken(findUser._id)
        const refreshToken = await generateRefreshToken(findUser._id)

        await RefreshToken.create({
            userId: findUser._id,
            token: refreshToken,
            expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
        return response.status(200).json({
            message: "Login Successful",
            accessToken,
            refreshToken
        })
    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: "Login failed",
            errorMessage: error.message
        })
    }
}

export const logOut = async (request, response) => {

    try {
        const { refreshToken } = request.body

        await RefreshToken.deleteOne({ token: refreshToken })


        return response.status(200).json({
            success: true,
            error: false,
            message: "Logout Successfully"
        })

    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: "Logout failed",
            Message: error.message
        })
    }
}

export const refresh = async (request, response) => {
    try {

        const { refreshToken } = request.body


        const storedRefreshToken = await RefreshToken.findOne({ refreshToken })
        if (!storedRefreshToken) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "No token"
            })
        }

        jwt.verify(storedRefreshToken.token, process.env.JWT_REFRESH_SECRET)
        await RefreshToken.deleteOne({ refreshToken: refreshToken })

        const newAccessToken = await generateAccessToken(storedRefreshToken.userId)
        const newRefreshToken = await generateRefreshToken(storedRefreshToken.userId)

        await RefreshToken.create({
            userId: storedRefreshToken.userId,
            token: newRefreshToken,
            expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        return response.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })

    } catch (error) {
        response.status(500).json({
            success: false,
            error: true,
            message: "Login failed",
            Message: error.message
        })
    }
}