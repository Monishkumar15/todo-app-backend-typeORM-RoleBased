import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { env } from "./config/env";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "Todo Application Role Based API using Node.js, TypeORM, JWT"
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["src/swagger-definitions.ts"]
  // apis: [path.join(__dirname, "./routes/*.ts")]
};

export const swaggerSetup = (app: Express) => {
  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
