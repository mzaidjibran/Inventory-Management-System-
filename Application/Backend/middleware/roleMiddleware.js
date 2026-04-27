import UserModel from "../models/UserModel.js";

export const roleMiddleware = (role) => {
    return async (request, response, next) => {
        try {
            const user = await UserModel.findById(request.user)
            if (!user) {
                return response.status(404).json({
                    success: false,
                    error: true,
                    message: "User not found"
                })
            }
            if (!role.includes(user.role)) {
                return response.status(403).json({
                    success: false,
                    error: true,
                    message: "Forbidden"
                })
            }
            next();
        } catch (error) {
            return response.status(500).json({
                success: false,
                error: true,
                message: "Internal server error"
            })
        }
    }
}