import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(new AppError("Invalid or expired token", 403));
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 403));
  }
};
