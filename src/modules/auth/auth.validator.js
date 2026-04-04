import AppError from "../../utils/AppError.js";

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // validate missing fields
  // Note: using optional chaining and trim to handle cases where email or password might be undefined or just whitespace
  if (!email?.trim() || !password?.trim()) {
    return next(new AppError("Email and password are required", 400));
  }

  req.body.email = email.trim().toLowerCase(); // sanitize email

  next();
};
