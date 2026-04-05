import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

export const getAllRecordsService = async (
  includeDeleted = false,
  userRole,
) => {
  if (includeDeleted && userRole !== "admin") {
    throw new AppError("Only admins can view deleted records", 403);
  }

  const records = await prisma.record.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
  });
  return { records };
};

export const getRecordService = async (id, userRole) => {
  const record = await prisma.record.findUnique({ where: { id } });
  if (!record) throw new AppError("Record not found", 404);

  if (record.deletedAt && userRole !== "admin") {
    throw new AppError("Record not found", 404);
  }

  return { record };
};

export const createRecordService = async (
  amount,
  type,
  category,
  date,
  notes,
  userId,
) => {
  const newRecord = await prisma.record.create({
    data: {
      amount,
      type,
      category,
      date: new Date(date),
      notes,
      createdBy: userId,
    },
  });

  return { record: newRecord };
};

export const updateRecordService = async (id, fields) => {
  const record = await prisma.record.findUnique({ where: { id } });
  if (!record) throw new AppError("Record not found", 404);
  if (record.deletedAt) throw new AppError("Record has been deleted", 400);

  const ALLOWED_FIELDS = ["amount", "type", "category", "date", "notes"];
  const updates = {};

  for (const field of ALLOWED_FIELDS) {
    if (fields[field] !== undefined) {
      updates[field] = fields[field];
    }
  }

  if (updates.date) updates.date = new Date(updates.date);

  const updatedRecord = await prisma.record.update({
    where: { id },
    data: updates,
  });

  return { record: updatedRecord };
};

export const deleteRecordService = async (id) => {
  const record = await prisma.record.findUnique({ where: { id } });
  if (!record) throw new AppError("Record not found", 404);
  if (record.deletedAt) throw new AppError("Record is already deleted", 400);

  const deletedRecord = await prisma.record.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { record: deletedRecord };
};
