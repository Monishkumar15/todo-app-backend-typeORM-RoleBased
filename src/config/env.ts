import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
dotenv.config();

// export const env = {
//   PORT: process.env.PORT || 3000,
//   DB_HOST: process.env.DB_HOST!,
//   DB_PORT: Number(process.env.DB_PORT),
//   DB_USERNAME: process.env.DB_USER!,
//   DB_PASSWORD: process.env.DB_PASS!,
//   DB_NAME: process.env.DB_NAME!,
//   JWT_SECRET: process.env.JWT_SECRET!,
//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
// };

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USERNAME: process.env.DB_USERNAME || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "root",
  DB_NAME: process.env.DB_NAME || "todo2_db",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};