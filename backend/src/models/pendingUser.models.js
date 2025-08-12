import mongoose, { Schema } from "mongoose";
const PendingUserSchema = new Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  otp: String,
  otpExpiry: Date,
});
export const PendingUser = mongoose.model("PendingUser", PendingUserSchema);
