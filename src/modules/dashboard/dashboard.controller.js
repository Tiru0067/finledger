import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/response.js";
import AppError from "../../utils/AppError.js";
import {
  getDashboardSummaryService,
  getDashboardCategoriesService,
  getDashboardTrendsService,
  getRecentTransactionsService,
} from "./dashboard.service.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await getDashboardSummaryService();
  sendResponse(res, 200, "Dashboard summary fetched", data);
});

export const getDashboardCategories = asyncHandler(async (req, res) => {
  const categories = await getDashboardCategoriesService();
  sendResponse(res, 200, "Category breakdown fetched", { categories });
});

export const getDashboardTrends = asyncHandler(async (req, res) => {
  const { period = "monthly" } = req.query;
  if (!["monthly", "weekly"].includes(period)) {
    throw new AppError("period must be 'monthly' or 'weekly'", 400);
  }

  const trends = await getDashboardTrendsService(period);
  sendResponse(res, 200, "Trends fetched", { period, trends });
});

export const getDashboardRecentTransactions = asyncHandler(async (req, res) => {
  let limit = parseInt(req.query.limit, 10) || 5;
  if (limit < 1) limit = 1;
  if (limit > 50) limit = 50;

  const records = await getRecentTransactionsService(limit);
  sendResponse(res, 200, "Recent transactions fetched", { limit, records });
});
