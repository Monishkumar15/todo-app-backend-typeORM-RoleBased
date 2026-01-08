import express from "express";
import "reflect-metadata";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import groupRoutes from "./routes/group.routes";
import adminRoutes from "./routes/admin.routes";
import { swaggerSetup } from "./swagger";
import { responseInterceptor } from "./interceptors/response.interceptor";
import { loggerInterceptor } from "./interceptors/logger.interceptor";
import { errorInterceptor } from "./interceptors/error.interceptor";

const app = express();

//Global Middlewares
app.disable("etag"); // Disable etag for all responses to prevent caching issues
app.use(express.json());      // Parse JSON request bodies  


// Swagger setup
swaggerSetup(app);

// Request interceptor
app.use(loggerInterceptor);

// Response interceptor
app.use(responseInterceptor);

// Base routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "API is running" });
});


// ERROR INTERCEPTOR MUST BE LAST
app.use(errorInterceptor);

export default app;
