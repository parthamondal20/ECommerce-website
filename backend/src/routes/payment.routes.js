import { createRazorPayOrder } from "../controllers/payment.controllers.js";
import { Router } from "express";
const router=Router();
router.route("/razorpay-order").post(createRazorPayOrder);
export default router;