import express from "express";
import "dotenv/config";
import { connectDb, disconnectDB } from "./config/db.js";

// Route modules
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import recordRoutes from "./modules/records/records.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

connectDb();
const app = express();

// Middleware
app.use(express.json()); // parse JSON request bodies

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

// Start the server
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Server running at http://localhost:${PORT}`);
  } else {
    console.log(`Server started on port ${PORT}`);
  }
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
