import jwt from 'jsonwebtoken';

export const generateAccessToken = async (userId, userRole) => {
    return await jwt.sign(
        { userId, role: userRole },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "24h" }
    )
}

export const generateRefreshToken = async (userId) => {
    return await jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
}