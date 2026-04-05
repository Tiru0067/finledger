import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcrypt";

export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true, isSuperAdmin: true }, // exclude sensitive fields
  });
  return { users };
};

export const getUserService = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: true, isSuperAdmin: true }, // exclude sensitive fields
  });

  if (!user) throw new AppError("User not found", 404);

  return { user };
};

export const createUserService = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Role and status are intentionally excluded from creation.
    // All users start as viewer + active by default.
    // Admins must explicitly update role/status after creation.
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      omit: { password: true, isSuperAdmin: true },
    });
    return { user: newUser };
  } catch (error) {
    console.log(error);
    if (error.code === "P2002") {
      throw new AppError("Email already exists", 409);
    }
    throw error;
  }
};

export const updateUserService = async (id, fields) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);

  // Prevent updates to super admin
  if (user.isSuperAdmin) {
    throw new AppError("Super admin cannot be modified", 403);
  }

  const isReactivationOnly =
    Object.keys(fields).length === 1 && fields.status === "active";

  if (user.status !== "active" && !isReactivationOnly) {
    throw new AppError("Reactivate user before making changes", 400);
  }

  const ALLOWED_FIELDS = ["name", "email", "password", "role", "status"];
  const updates = {};

  for (const field of ALLOWED_FIELDS) {
    if (fields[field] !== undefined) {
      updates[field] = fields[field];
    }
  }

  // hash password if provided
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updates,
    omit: { password: true, isSuperAdmin: true }, // exclude sensitive fields
  });

  return { updatedUser };
};

export const deleteUserService = async (id) => {
  // Check if user exists before attempting to "delete"
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);

  // Prevent deactivation of super admin
  if (user.isSuperAdmin) {
    throw new AppError("Super admin cannot be deactivated", 403);
  }

  // Already inactive
  if (user.status === "inactive") {
    throw new AppError("User is already inactive", 400);
  }

  // Instead of deleting, we set status to "inactive" for soft delete
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status: "inactive" },
    omit: { password: true, isSuperAdmin: true }, // exclude sensitive fields
  });

  return { user: updatedUser };
};
