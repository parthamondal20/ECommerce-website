import mongoose, { Schema } from "mongoose";
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    maxStocks: {
      type: Number,
      default: 20,
    },
    brand: {
      type: String,
    },
    image: {
      type: String, // image url
    },
    wishlisted: {
      type: Boolean,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    size: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
export const Product = mongoose.model("Product", productSchema);
