import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
});
const updateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.updateMany(
      {},
      {
        $set: {
          cartList: [],
          wishlist: [],
          orderList: [],
        },
      }
    );
    console.log("Successfully update the user data ");
  } catch (error) {
    console.log("Failed to update the user details");
    console.log(error);
  } finally {
    await mongoose.disconnect();
  }
};

updateUsers();
