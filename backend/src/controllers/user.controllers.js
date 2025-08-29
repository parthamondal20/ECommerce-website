import { User } from "../models/user.models.js";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { ApiError } from "../utiles/ApiError.js";
import jwt from "jsonwebtoken";
import { Address } from "../models/address.models.js";
import { OAuth2Client } from "google-auth-library";
import { sendMail } from "../utiles/emailServices.js";
import { PendingUser } from "../models/pendingUser.models.js";
import axios from "axios";
import {
  uploadFileCloudinary,
  deleteFromCloudinary,
} from "../utiles/cloudinary.js";

const generateAccessAndRefreshToken = async function (userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh Token is required");
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken._id);
  console.log("the user is ", user);
  if (!user) {
    throw new ApiError(400, "Invalid refresh token!");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(403, "Refresh token is not matched !");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ REQUIRED for cross-origin cookies
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  console.log(user._id);
  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(200, "Successfully regenerate the access token", {
        accessToken,
      })
    );
});

const registerUser = asyncHandler(async function (req, res) {
  const { username, email, password } = req.body;
  if (!username) {
    throw new ApiError(400, "Username is required to create account");
  }
  if (!email) {
    throw new ApiError(400, "email is required to create account");
  }
  if (!password) {
    throw new ApiError(400, "password is required to create account");
  }
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User already existed ! Try to Login");
  }
  return res.status(200).json({ message: "new User try to create an account" });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, context } = req.body;
  if (context === "reset-password") {
    // For forgot password
    const user = await User.findOne({ email });
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      throw new ApiError(400, "Invalid or expired OTP!");
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "OTP verified successfully"));
  }

  // For new registration
  const pending = await PendingUser.findOne({ email });

  if (!pending || pending.otp !== otp || pending.otpExpiry < new Date()) {
    throw new ApiError(400, "Invalid or expired OTP!");
  }

  const user = await User.create({
    username: pending.username,
    email: pending.email,
    password: pending.password,
    isVerified: true,
    otp: null,
    otpExpiry: null,
  });

  await PendingUser.deleteMany({ email });
  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ REQUIRED for cross-origin cookies
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "User is sign up successfully", newUser));
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email, username, password, context } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  if (context === "reset-password") {
    // for  reset password verification
    const user = await User.findOne({ email });
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  } else if (context === "register") {
    // for new User
    const pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      pendingUser.otp = otp;
      pendingUser.otpExpiry = otpExpiry;
      pendingUser.password = password;
      await pendingUser.save();
    } else {
      await PendingUser.create({
        username,
        email,
        password,
        otp,
        otpExpiry,
      });
    }
  } else {
    throw new ApiError(400, "Invalid otp request");
  }
  await sendMail({
    to: email,
    subject: "Verify your Email",
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Otp is sended to the user email"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(402, "Email not found");
  }
  if (!password) {
    throw new ApiError(402, "Password not found");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(402, "User not found or invalid credentials");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(402, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  user.isVerified = true;
  await user.save();
  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ REQUIRED for cross-origin cookies
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "User is sign in successfully", newUser));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found!");
  }
  if (!password) {
    throw new ApiError(400, "Password not found!");
  }
  user.password = password;
  await user.save();
  return res.status(200).json(new ApiResponse(200, "Password changed!"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ success: true, message: "User logged out successfully" });
});

const authWithGoogle = asyncHandler(async (req, res) => {
  // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;
  const googleUser = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const { email, name, picture } = googleUser.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      username: name,
      provider: "Google",
      avatar: picture,
    });
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ REQUIRED for cross-origin cookies
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "User successfully login!", user));
});

const editUserProfile = asyncHandler(async (req, res) => {
  let { userId, mobileNo, username } = req.body;

  const user = await User.findById(userId);
  if (!mobileNo || mobileNo === "") {
    mobileNo = user.mobileNo;
  }
  if (!username || username === "") {
    username = user.username;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        mobileNo,
        username,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res.status(200).json({
    message: "Successfully save changes",
    data: updatedUser,
  });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const file = req.file;
  const userId = req.body.userId;
  if (!req.file) {
    throw new ApiError(401, "Avatar photo not found!");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (user.avatarPublicId) {
    await deleteFromCloudinary(user.avatarPublicId);
  }
  const uploaded = await uploadFileCloudinary(file.path);
  if (!uploaded) {
    throw new ApiError(401, "Failed to upload the avatar");
  }

  user.avatar = uploaded.secure_url;
  user.avatarPublicId = uploaded.public_id;
  await user.save();
  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully update the avatar!", updatedUser));
});

const getUserCart = asyncHandler(async (req, res) => {
  const {id} = req.params;
  // 🧱 Fetch user + populate full product info from cartList
  const userData = await User.findById(id).populate({
    path: "cartList",
    populate: {
      path: "product",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched user cart list",
        userData.cartList
      )
    );
});

const removeFromCart = asyncHandler(async (req, res) => {
  const {userId }= req.params;
  const productId = req.params.productId;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(
      404,
      "User not found in database during remove the product from the database"
    );
  }
  user.cartList = user.cartList.filter(
    (item) => item.product.toString() !== productId
  );
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "successfully remove item from the cart"));
});

const updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId, userId, quantity } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User not found!");
  }
  const cartItemIndex = user.cartList.findIndex(
    (item) => item.product._id.toString() === productId
  );
  if (cartItemIndex === -1) {
    throw new ApiError(400, "Product not found in the user cartlist");
  }
  user.cartList[cartItemIndex].quantity = quantity;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Cart quatity updated successfully"));
});

const getAddressList = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate("addressList");
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  const addressList = user.addressList;
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully get the user addressList", addressList)
    );
});

const saveUserAddress = asyncHandler(async (req, res) => {
  const { userId, username, mobileNo, address, city, state, pincode } =
    req.body;
  if (!userId) {
    throw new ApiError(401, "User Not found during saving the address of user");
  }

  const existing = await Address.findOne({
    user: userId,
    username,
    mobileNo,
    addressLine: address,
    city,
    state,
    pincode,
  });

  if (existing) {
    return res.status(200).json({
      success: false,
      message: "Duplicate address information",
      data: existing,
    });
  }
  const addressInfo = await Address.create({
    user: userId,
    username,
    mobileNo,
    addressLine: address,
    city,
    state,
    pincode,
  });

  if (!addressInfo) {
    throw new ApiError(401, "Failed to save the user address");
  }

  await User.findByIdAndUpdate(userId, {
    $push: { addressList: addressInfo._id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully save the address", addressInfo));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId).populate({
    path: "orderList",
    populate: [
      {
        path: "productDetails.product",
        model: "Product",
      },
      {
        path: "address",
        model: "Address",
      },
    ],
  });

  // console.log(user.orderList);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "successfully fetch the user orderlist",
        user.orderList
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  editUserProfile,
  authWithGoogle,
  refreshAccessToken,
  getUserCart,
  removeFromCart,
  updateCartQuantity,
  getAddressList,
  saveUserAddress,
  getAllOrders,
  uploadAvatar,
  verifyOtp,
  sendOtp,
  resetPassword,
};
