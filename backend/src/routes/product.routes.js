import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProductIncart,
  addToWishList,
  getWishlist,
  removeFromWishlist,
  getProductSuggestions,
  submitReview,
  getProductReviewList,
  deleteReview,
  getAllCoupons,
  markCouponUsed,
  updateProductStocks,
  getBestCoupon,
  getSearchCoupon,
  updateProductDetails,
} from "../controllers/product.controllers.js";
import authenticateUser from "../middlewares/authenticateUser.js";
const router = Router();
router.get("/", getProducts);
router.get("/suggestions", getProductSuggestions);
router.get("/product-details/:id", getProductById);
router.get("/review-list/:productId", getProductReviewList);
router.use(authenticateUser);
router.post("/addToCart", addProductIncart);
router.get("/myWishlist/:userId", getWishlist);
router.post("/addToWishlist", addToWishList);
router.post("/removeFromWishlist", removeFromWishlist);
router.post("/submit-review", submitReview);
router.delete("/review/:productId/:reviewId", deleteReview);
router.post("/coupons/:userId", getAllCoupons);
router.put("/mark-used", markCouponUsed);
router.put("/update-stocks", updateProductStocks);
router.get("/best-coupon/:productId", getBestCoupon);
router.post("/check-coupon", getSearchCoupon);
router.put("/update-product-details", updateProductDetails);
export default router;
