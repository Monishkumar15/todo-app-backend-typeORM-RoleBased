import express from "express";
import "reflect-metadata";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import groupRoutes from "./routes/group.routes";
import adminRoutes from "./routes/admin.routes";
// import { errorMiddleware } from "./middleware/error.middleware";
import { swaggerSetup } from "./swagger";

const app = express();

/* ---------------- GLOBAL MIDDLEWARE ---------------- */
app.use(express.json());

/* ---------------- SWAGGER ---------------- */
swaggerSetup(app);

/* ---------------- BASE API ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/admin", adminRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "API is running" });
});

/* ---------------- ERROR HANDLER ---------------- */
// app.use(errorMiddleware);

export default app;
