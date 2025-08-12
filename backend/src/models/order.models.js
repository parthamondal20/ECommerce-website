import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productDetails: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      required: true,
      default: "cancelled",
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      // enum: ["COD", "UPI", "CARD", "NET_BANKING"],
    },
    paymentDetails: {
      transactionId: { type: String }, // For UPI/Card/etc.
      paymentStatus: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "pending",
      },
      paidAt: { type: Date }, // Save timestamp of success
    },
    deliveryBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
