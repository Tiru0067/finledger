import express from "express";
import authMiddleware from "../../middlewares/auth.js";
import authorize from "../../middlewares/authorize.js";
import AppError from "../../utils/AppError.js";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./users.controller.js";

import { validateCreateUser, validateUpdateUser } from "./users.validator.js";

const router = express.Router();

router
  .route("/")
  .all(authMiddleware, authorize("admin"))
  .get(getAllUsers)
  .post(validateCreateUser, createUser);

router.param("id", (req, res, next, id) => {
  req.params.id = parseInt(id);
  if (isNaN(req.params.id)) throw new AppError("Invalid ID", 400);
  next();
});

router
  .route("/:id")
  .all(authMiddleware, authorize("admin"))
  .get(getUser)
  .put(validateUpdateUser, updateUser)
  .delete(deleteUser);

export default router;
