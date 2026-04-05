import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/response.js";
import {
  getAllRecordsService,
  getRecordService,
  createRecordService,
} from "./records.service.js";

export const getAllRecords = asyncHandler(async (req, res) => {
  const includeDeleted = req.query.includeDeleted === "true";
  const data = await getAllRecordsService(includeDeleted, req.user.role);
  sendResponse(res, 200, "Records loaded successfully", data);
});

export const getRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const includeDeleted = req.query.includeDeleted === "true";
  const data = await getRecordService(id, includeDeleted, req.user.role);
  sendResponse(res, 200, "Record loaded successfully", data);
});

export const createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  const userId = parseInt(req.user.id);
  const data = await createRecordService(
    amount,
    type,
    category,
    date,
    notes,
    userId,
  );
  sendResponse(res, 201, "Record created successfully", data);
});

export const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const data = await updateRecordService(id, fields);
  sendResponse(res, 201, "Record updated successfully", data);
});

export const deleteRecord = (req, res) => {
  res
    .status(204)
    .json({ message: "DELETE /records/:id - not implemented yet" });
};
