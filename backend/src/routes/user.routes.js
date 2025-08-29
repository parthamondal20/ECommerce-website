import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  authWithGoogle,
  getUserCart,
  removeFromCart,
  getAddressList,
  saveUserAddress,
  getAllOrders,
  editUserProfile,
  uploadAvatar,
  refreshAccessToken,
  verifyOtp,
  sendOtp,
  resetPassword,
  updateCartQuantity,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import authenticateUser from "../middlewares/authenticateUser.js";
const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/googleLogin", authWithGoogle);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.route("/logout").post(logoutUser);
router.post("/reset-password", resetPassword);
// router.use(authenticateUser);
router.route("/myCart/:id").get(getUserCart);
router.delete("/myCart/remove/:userId/:productId", removeFromCart);
router.put("/update-cart-quantity", updateCartQuantity);
router.route("/address/:userId").get(getAddressList);
router.post("/save-address", saveUserAddress);
router.get("/orders/:userId", getAllOrders);
router.post("/edit-profile", editUserProfile);
router.post("/upload-avatar", upload.single("file"), uploadAvatar);
export default router;
