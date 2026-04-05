import express from "express";
import authMiddleware from "../../middlewares/auth.js";
import authorize from "../../middlewares/authorize.js";
import {
  getDashboardSummary,
  getDashboardCategories,
  getDashboardTrends,
  getDashboardRecentTransactions,
} from "./dashboard.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", authorize("viewer", "analyst", "admin"), getDashboardSummary);
router.get(
  "/categories",
  authorize("analyst", "admin"),
  getDashboardCategories,
);
router.get("/trends", authorize("analyst", "admin"), getDashboardTrends);
router.get(
  "/recent",
  authorize("analyst", "admin"),
  getDashboardRecentTransactions,
);

export default router;
