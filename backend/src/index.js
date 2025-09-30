// src/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sql from "./config/neonsetup.js";

// Import Routes
import authRoutes from "./routes/auth.js";
import testRoutes from "./routes/tests.js";
import placementRoutes from "./routes/placement.js";
import adminRoutes from "./routes/admin.js";
import profileRoutes from "./routes/profile.js";
// import dashboardRoutes from "./routes/dashboard.js";

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
// app.use("/api/dashboard", dashboardRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("AES Platform Backend is running 🚀");
});

// Start server
async function ensureSchema() {
  try {
    await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_url TEXT`;
    // Enforce one attempt per user per test (except cancelled)
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS uq_user_test_once ON user_test_results (user_id, test_id) WHERE status <> 'cancelled'`;
  } catch (err) {
    console.error("Schema ensure failed:", err);
  }
}

app.listen(PORT, async () => {
  await ensureSchema();
  console.log(`Server running on http://localhost:${PORT}`);
});
