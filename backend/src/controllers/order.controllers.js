import { Order } from "../models/order.models.js";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utiles/ApiError.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const createOrder = asyncHandler(async (req, res) => {
  const { orderDetails, paymentData } = req.body;
  const normalizedItems = orderDetails.items.map((item, index) => {
    const product = item.product || item;
    return {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      quantity: item.quantity || 1,
      size: product.size,
    };
  });

  // 🔐 Signature Verification (if not COD)

  if (orderDetails.paymentMethod !== "cash on delivery") {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      paymentData;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    console.log("the secret is valid :", secret);

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    console.log("expected:", expectedSignature);
    console.log("received:", razorpay_signature);
    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }
  }

  const newOrder = await Order.create({
    user: orderDetails.userId,
    productDetails: normalizedItems.map((item) => ({
      product: item._id,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    })),
    status: "pending",
    address: orderDetails.addressId,
    amount: parseInt(orderDetails.amount),
    paymentMethod: orderDetails.paymentMethod,
    paymentDetails: {
      transactionId: paymentData.razorpay_payment_id,
      paymentStatus:
        orderDetails.paymentMethod === "cash on delivery"
          ? "Pending"
          : "Success",
      paidAt:
        orderDetails.paymentMethod === "cash on delivery" ? null : new Date(),
    },
    deliveryBy: orderDetails.deliveryBy,
  });

  if (!newOrder) {
    throw new ApiError(401, "Failed to place Order");
  }

  const user = await User.findById(orderDetails.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.orderList.push(newOrder._id);
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "SuccessFully placed order", newOrder));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    throw new ApiError("Order id not found");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(400, "order not found");
  }
  if (order.status === "cancelled") {
    throw new ApiError(400, "Oder already cancelled!");
  }
  order.status = "cancelled";
  await order.save();
  return res.status(200).json(new ApiResponse(200, "Order cancelled!"));
});

export { createOrder, cancelOrder };
