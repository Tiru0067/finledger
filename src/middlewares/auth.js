import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { prisma } from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(new AppError("Invalid or expired token", 403));
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // check user still exists and is active
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return next(new AppError("User no longer exists", 401));
    if (user.status !== "active")
      return next(new AppError("Account is inactive", 401));

    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 403));
  }
};

export default authMiddleware;
