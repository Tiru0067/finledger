import AppError from "../../utils/AppError.js";

const VALID_TYPES = ["income", "expense"];
const VALID_CATEGORIES = [
  "revenue",
  "salary",
  "operations",
  "marketing",
  "utilities",
  "rent",
  "travel",
  "equipment",
  "taxes",
  "other",
];

const validateAmount = (amount) => {
  if (isNaN(amount) || Number(amount) <= 0)
    return "Amount must be a positive number";
  return null;
};

const validateDate = (date) => {
  if (isNaN(new Date(date).getTime()))
    return "Invalid date format. Use YYYY-MM-DD (e.g. 2026-04-05)";
  return null;
};

export const validateCreateRecord = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new AppError("Request body is required", 400));
  }

  const { amount, type, category, date } = req.body;

  // check missing fields
  const missing = [];
  if (amount === undefined) missing.push("Amount");
  if (!type) missing.push("Type");
  if (!category) missing.push("Category");
  if (!date) missing.push("Date");

  if (missing.length > 0) {
    const last = missing.pop();
    const message =
      missing.length > 0
        ? `${missing.join(", ")} and ${last} are required`
        : `${last} is required`;
    return next(new AppError(message, 400));
  }

  const amountError = validateAmount(amount);
  if (amountError) return next(new AppError(amountError, 400));

  if (!VALID_TYPES.includes(type))
    return next(new AppError("Type must be income or expense", 400));

  if (!VALID_CATEGORIES.includes(category))
    return next(
      new AppError(
        `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        400,
      ),
    );

  const dateError = validateDate(date);
  if (dateError) return next(new AppError(dateError, 400));

  next();
};

export const validateUpdateRecord = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new AppError("Request body is required", 400));
  }

  const { amount, type, category, date } = req.body;

  if (amount !== undefined) {
    const amountError = validateAmount(amount);
    if (amountError) return next(new AppError(amountError, 400));
  }

  if (type && !VALID_TYPES.includes(type))
    return next(new AppError("Type must be income or expense", 400));

  if (category && !VALID_CATEGORIES.includes(category))
    return next(
      new AppError(
        `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        400,
      ),
    );

  if (date) {
    const dateError = validateDate(date);
    if (dateError) return next(new AppError(dateError, 400));
  }

  next();
};
