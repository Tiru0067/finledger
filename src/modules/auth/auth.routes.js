import express from "express";
import { login } from "./auth.controller.js";
import { validateLogin } from "./auth.validator.js";

const router = express.Router();

router.post("/login", validateLogin, login);

export default router;
