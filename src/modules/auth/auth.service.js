import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";

export const loginService = async (email, password) => {
  // 1. validate user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new AppError("Invalid credentials", 401);

  // 2. validate password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const { id, name, role, status } = user;

  // 3. validate account is active
  if (status === "inactive") throw new AppError("Account is inactive", 403);

  // 4. generate token
  const token = jwt.sign({ id, email: user.email }, process.env.SECRET_KEY, {
    expiresIn: "8h",
  });

  return {
    token,
    user: { id, name, email: user.email, role },
  };
};
