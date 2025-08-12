import { Router } from "express";
import { createOrder, cancelOrder } from "../controllers/order.controllers.js";
const router = Router();
router.route("/save-paid").post(createOrder);
router.post("/cancel-order", cancelOrder);
export default router;
