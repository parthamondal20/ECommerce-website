import mongoose, { Schema } from "mongoose";
const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
    },
    maxUses: {
      type: Number,
      default: 1000,
    },
    usedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    firstTimeOnly: {
      type: Boolean,
      default: false,
    },
    isStackable: {
      type: Boolean,
      default: false,
    },
    applicableCategories: [
      {
        type: String,
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
