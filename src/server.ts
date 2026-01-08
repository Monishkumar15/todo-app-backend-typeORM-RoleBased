import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
