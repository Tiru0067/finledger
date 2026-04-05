import AppError from "../../utils/AppError.js";

// reusable validators
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{7,}$/;
  if (!passwordRegex.test(password)) {
    return "Password must be at least 7 characters and include uppercase, lowercase, number, and special character";
  }
  return null;
};

//
//
export const validateCreateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  // check missing fields
  const missing = [];
  if (!name?.trim()) missing.push("Name");
  if (!email?.trim()) missing.push("Email");
  if (!password?.trim()) missing.push("Password");

  if (missing.length > 0) {
    const last = missing.pop();
    // construct error message with clarity on missing fields
    const message =
      missing.length > 0
        ? `${missing.join(", ")} and ${last} are required`
        : `${last} is required`;
    return next(new AppError(message, 400));
  }

  // validate email and password formats
  const emailError = validateEmail(email);
  if (emailError) return next(new AppError(emailError, 400));

  const passwordError = validatePassword(password);
  if (passwordError) return next(new AppError(passwordError, 400));

  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { name, email, password, role, status } = req.body;

  // all fields optional — only validate what's provided

  if (name !== undefined && !name?.trim()) {
    return next(new AppError("Name cannot be empty", 400));
  }

  if (email) {
    const emailError = validateEmail(email);
    if (emailError) return next(new AppError(emailError, 400));
  }

  if (password) {
    const passwordError = validatePassword(password);
    if (passwordError) return next(new AppError(passwordError, 400));
  }

  if (role && !["viewer", "analyst", "admin"].includes(role)) {
    return next(new AppError("Invalid role", 400));
  }

  if (status && status !== "active") {
    return next(
      new AppError("Use DELETE /users/:id to deactivate a user", 400),
    );
  }

  next();
};
