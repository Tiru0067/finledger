import express from "express";
import dotenv from "dotenv";

// Route modules
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import recordRoutes from "./modules/records/records.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

dotenv.config();

// Middleware
app.use(express.json()); // parse JSON request bodies

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

// Start the server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
