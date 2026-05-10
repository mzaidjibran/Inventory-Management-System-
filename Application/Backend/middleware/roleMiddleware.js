import UserModel from "../models/UserModel.js";

export const roleMiddleware = (allowedRoles) => {
  return async (request, response, next) => {
    try {
      const user = await UserModel.findById(request.userId);
      if (!user) {
        return response.status(404).json({
          success: false,
          error: true,
          message: "User not found!",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return response.status(403).json({
          success: false,
          error: true,
          message: `Access denied. Only ${allowedRoles.join(", ")} can access this resource.`,
        });
      }

      request.userRole = user.role;
      next();
    } catch (error) {
      response.status(500).json({ success: false, error: true, message: error.message });
    }
  };
};

export const requireAdmin = roleMiddleware(["admin"]);

export const requireEmployee = roleMiddleware(["admin", "employee"]);