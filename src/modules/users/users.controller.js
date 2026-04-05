import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/response.js";
import {
  getAllUsersService,
  getUserService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "./users.service.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const data = await getAllUsersService();
  sendResponse(res, 200, "Users loaded successfully", data);
});

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await getUserService(id);
  sendResponse(res, 200, "User loaded successfully", data);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  sendResponse(res, 201, "User created successfully", data);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const data = await updateUserService(id, fields);
  sendResponse(res, 201, "User updated successfully", data);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await deleteUserService(id);
  sendResponse(res, 200, "User deactivated successfully", data);
});
