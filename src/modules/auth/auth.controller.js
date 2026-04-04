import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/response.js";
import { loginService } from "./auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  sendResponse(res, 200, "Login successful", data);
});
