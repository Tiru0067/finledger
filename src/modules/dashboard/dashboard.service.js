import { prisma } from "../../config/db.js";

export const getDashboardSummaryService = async () => {
  const records = await prisma.record.findMany({
    where: { deletedAt: null },
    select: { amount: true, type: true },
  });

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const record of records) {
    if (record.type === "income") totalIncome += Number(record.amount);
    else totalExpenses += Number(record.amount);
  }

  return {
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_balance: totalIncome - totalExpenses,
  };
};

export const getDashboardCategoriesService = async () => {
  const results = await prisma.record.groupBy({
    by: ["category"],
    where: { type: "expense", deletedAt: null },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  return results.map((r) => ({
    category: r.category,
    total: Number(r._sum.amount),
  }));
};

export const getDashboardTrendsService = async (period) => {
  const records = await prisma.record.findMany({
    where: { deletedAt: null },
    select: { amount: true, type: true, date: true },
    orderBy: { date: "asc" },
  });

  const buckets = {};

  for (const record of records) {
    const key = getPeriodKey(record.date, period);
    if (!buckets[key])
      buckets[key] = { period_start: key, income: 0, expenses: 0 };

    if (record.type === "income") buckets[key].income += Number(record.amount);
    else buckets[key].expenses += Number(record.amount);
  }

  return Object.values(buckets).map((b) => ({
    ...b,
    net: b.income - b.expenses,
  }));
};

export const getRecentTransactionsService = async (limit) => {
  const records = await prisma.record.findMany({
    where: { deletedAt: null },
    orderBy: [{ date: "desc" }, { id: "desc" }],
    take: limit,
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true,
      createdBy: true,
    },
  });

  return records.map((r) => ({ ...r, amount: Number(r.amount) }));
};

// ── Helper ───────────────────────────────────────────────────────────────────
function getPeriodKey(date, period) {
  const d = new Date(date);
  if (period === "monthly") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  } else {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split("T")[0];
  }
}
