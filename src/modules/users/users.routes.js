import express from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
} from "./users.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.route("/:id").get(getUser).post(createUser).put(updateUser);

export default router;
