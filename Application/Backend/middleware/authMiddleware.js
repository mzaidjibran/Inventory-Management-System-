import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.userId = decoded.userId;

    req.userRole = decoded.role; // setting role

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      error: true,
      message: "Invalid or expired token"
    });
  }
};

export const verifyToken = authMiddleware;