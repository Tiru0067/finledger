import AppError from "../utils/AppError.js";

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden: insufficient permissions", 403);
    }
    next();
  };

export default authorize;
