import { asyncHandler } from "../utiles/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utiles/ApiError.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const authenticateUser = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");
  if (!accessToken) {
    throw new ApiError(401, "Access Token missing");
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid token! user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access Token expired");
    }
    throw new ApiError(401, "Invalid access token");
  }
});

export default authenticateUser;
