import UserModel from "../models/UserModel.js";

export const roleMiddleware = (allowedRoles) => {
  return async (request, response, next) => {
    try {
      const user = await UserModel.findById(request.userId);
      if (!user) {
        return response.status(404).json({
          success: false,
          error: true,
          message: "User not found",
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
      return response.status(500).json({
        success: false,
        error: true,
        message: "Internal server error",
      });
    }
  };
};

export const requireAdmin = async (request, response, next) => {
  try {
    const user = await UserModel.findById(request.userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Admin not found",
      });
    }
    
    if (user.role !== "admin") {
      return response.status(403).json({
        success: false,
         error: true,
        message: "Admin access required",
      });
    }
    
    next();
  } catch (error) {
    return response.status(500).json({
      success: false,
       error: true,
      message: error.message,
    });
  }
};

export const requireEmployee = async (request, response, next) => {
  try {
    const user = await UserModel.findById(request.userId);
    if (!user) {
      return response.status(404).json({
        success: false,
         error: true,
        message: "User not found",
      });
    }
    
    if (!["admin", "employee"].includes(user.role)) {
      return response.status(403).json({
        success: false,
         error: true,
        message: "Employee access required",
      });
    }
    
    next();
  } catch (error) {
    return response.status(500).json({
      success: false,
       error: true,
      message: error.message,
    });
  }
};
