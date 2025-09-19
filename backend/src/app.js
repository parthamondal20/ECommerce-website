import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import orderRouter from "./routes/order.routes.js";
import healthRouter from "./routes/health.routes.js";
import authenticateUser from "./middlewares/authenticateUser.js";
import healthRouter from "./routes/health.routes.js";
import dotenv from "dotenv";
const app = express();
dotenv.config({
  path: "./.env",
});
app.use(express.json());
app.use(
  cors({
    origin: "https://e-commerce-website-three-drab.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/payment",  paymentRouter);
app.use("/api/v1/order",orderRouter);
app.use("/api/v1/health", healthRouter);
app.use(errorHandler);
export { app };
