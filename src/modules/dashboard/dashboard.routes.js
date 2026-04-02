import express from "express";
import {
  getDashboardSummary,
  getDashboardCategories,
  getDashboardTrends,
  getDashboardRecentTransactions,
} from "./dashboard.controller.js";

const router = express.Router();

router.get("/", getDashboardSummary);
router.get("/categories", getDashboardCategories);
router.get("/trends", getDashboardTrends);
router.get("/recent", getDashboardRecentTransactions);

export default router;
