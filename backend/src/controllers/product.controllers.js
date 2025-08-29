import { Product } from "../models/product.models.js";
import { Review } from "../models/review.models.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { ApiError } from "../utiles/ApiError.js";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Coupon } from "../models/coupon.models.js";
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape special chars
}

const getProducts = asyncHandler(async (req, res) => {
  const { category="", sort="", query="" } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  const escapedQuery = escapeRegex(query.trim());
  if (escapedQuery) {
    filter.name = { $regex: escapedQuery, $options: "i" };
  }
  let sortQuery = {};
  if (sort === "price-asc") sortQuery.price = 1;
  else if (sort === "price-desc") sortQuery.price = -1;
  else if (sort === "rating-desc") sortQuery.rating = -1;
  else if (sort === "Newest") sortQuery.createdAt = 1;
  else if (sort === "Featured" || !sort) sortQuery.name = 1;

  const result = await Product.find(filter).sort(sortQuery);
  if (!result) {
    throw new ApiError(500, "Error while fetching the products");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "successfully fetched all products", result));
});

const getProductSuggestions = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.json([]);
  }
  const suggestions = await Product.find(
    {
      name: { $regex: query, $options: "i" },
    },
    { name: 1 }
  ).limit(7);
  return res.status(200).json(suggestions);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product Not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Product fetched successfully", product));
});

const addProductIncart = asyncHandler(async (req, res) => {
  const { userId, productId, size } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const existingItem = user.cartList.find(
    (item) => item.product.toString() === productId
  );
  await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        size: size,
      },
    },
    {
      new: true,
    }
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cartList.push({
      product: productId,
      quantity: 1,
    });
  }
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "successfully add product in cart"));
});

const getWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Cannot get the userId");
  }
  const user = await User.findById(userId).populate("wishlist");
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  const wishlist = user.wishlist;
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully get the user wishlist", wishlist));
});

const addToWishList = asyncHandler(async (req, res) => {
  const { productId, userId } = req.body;
  if (!productId || !userId) {
    throw new ApiError(
      401,
      "The required information is not available to add to wishlist"
    );
  }
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(401, "Product not found");
  }
  user.wishlist.push(productId);
  await user.save();
  product.wishlisted = true;
  await product.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully added to the wishlist", user));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId, userId } = req.body;
  if (!productId || !userId) {
    throw new ApiError(401, "Invalid ceredentials");
  }
  const user = await User.findById(userId).select("-password -refreshToken");
  const wishlist = user.wishlist.filter((Id) => Id.toString() !== productId);
  user.wishlist = wishlist;
  await user.save();
  return res.status(200).json({ message: "Product removed" });
});

const submitReview = asyncHandler(async (req, res) => {
  const { user, product, comment, rating } = req.body;
  const review = await Review.create({
    user,
    product,
    rating,
    comment,
  });
  if (!review) {
    throw new ApiError(400, "Failed to save the review");
  }
  await Product.findByIdAndUpdate(product, {
    $push: {
      reviews: review._id,
    },
  });
  const allReviews = await Review.find({ product: product });
  const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await Product.findByIdAndUpdate(product, { rating: avgRating.toFixed(1) });

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully submitted the review"));
});

const getProductReviewList = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product Id not found");
  }
  const reviewList = await Product.findById(productId)
    .sort({ createdAt: -1 })
    .populate({
      path: "reviews",
      populate: {
        path: "user",
      },
    });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully fetched the review List", reviewList)
    );
});

const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  await Product.findByIdAndUpdate(productId, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  const allReviews = await Review.find({ product: productId });

  let avgRating = 0;
  if (allReviews.length > 0) {
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    avgRating = parseFloat((total / allReviews.length).toFixed(1));
  }

  // 4. Update product rating
  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Review deleted successfully"));
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { cartItems } = req.body;
  const user = await User.findById(userId);
  const allCoupons = await Coupon.find({ isActive: true });
  let bestCoupon = null;
  let nearlyEligible = [];
  let validCoupons = [];
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartCategories = [
    ...new Set(cartItems.map((item) => item.product.category)),
  ];
  for (const coupon of allCoupons) {
    const isExpired = coupon.expiresAt < new Date();
    const alreadyUsed = coupon.usedBy.includes(userId);
    const firstTime = coupon.firstTimeOnly && user.orderList.length > 0;

    if (isExpired || alreadyUsed || firstTime) continue;

    if (
      coupon.applicableCategories.length > 0 &&
      !cartCategories.every((cat) => coupon.applicableCategories.includes(cat))
    ) {
      continue;
    }
    const eligible = cartTotal >= coupon.minOrderAmount;
    if (eligible) {
      const details = {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discount:
          coupon.type === "flat"
            ? coupon.discount
            : Math.floor((cartTotal * coupon.discount) / 100),
        expirey: coupon.expiresAt,
      };
      validCoupons.push(details);

      if (!bestCoupon || details.discount > bestCoupon.discount) {
        bestCoupon = details;
      }
    } else {
      const diff = coupon.minOrderAmount - cartTotal;
      nearlyEligible.push({
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        missingAmount: diff,
        discount: coupon.discount,
        type: coupon.type,
        expirey: coupon.expiresAt,
      });
    }
  }
  nearlyEligible.sort((a, b) => a.missingAmount - b.missingAmount);
  const topEligible = nearlyEligible.slice(0, 5);
  nearlyEligible = topEligible;
  return res.status(200).json(
    new ApiResponse(200, "Successfully fetched the coupon data", {
      bestCoupon,
      validCoupons,
      nearlyEligible,
    })
  );
});

const markCouponUsed = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;
  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    throw new ApiError(400, "Coupon not found");
  }
  coupon.usedBy.push(userId);
  await coupon.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully added the user in the coupon user details"
      )
    );
});

const updateProductStocks = asyncHandler(async (req, res) => {
  const { products } = req.body;
  for (const prod of products) {
    const productId = prod._id;
    const stocks = prod.maxStocks;
    await Product.findByIdAndUpdate(
      productId,
      {
        $set: { maxStocks: stocks - 1 },
      },
      { new: true }
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully updated the product stocks"));
});

const getBestCoupon = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(400, "Product not found");
  }
  const { category, price } = product;
  console.log(category, price);
  const coupons = await Coupon.find({
    applicableCategories: { $in: [category.toLowerCase()] },
  });

  if (!coupons.length) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "No coupons available for this category", null)
      );
  }
  let bestCoupon = null;
  for (const coupon of coupons) {
    if (coupon.minOrderAmount <= price) {
      if (!bestCoupon || bestCoupon.discount < coupon.discount) {
        if (coupon.type === "percentage") {
          coupon.discount = parseInt((price * coupon.discount) / 100);
        }
        bestCoupon = coupon;
      }
    }
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully fetched best coupon", bestCoupon));
});

const getSearchCoupon = asyncHandler(async (req, res) => {
  const { code, cartItems, userId } = req.body;

  // Calculate total amount
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Get all categories in the cart
  const cartCategories = [
    ...new Set(cartItems.map((item) => item.product.category)),
  ];

  // Fetch user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, "User not found", null));
  }

  // Fetch coupon (findOne instead of find to avoid array)
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Coupon is not valid", null));
  }

  // Validation checks
  const isExpired = coupon.expiresAt && coupon.expiresAt < new Date();
  const alreadyUsed = coupon.usedBy.includes(userId);
  const firstTimeInvalid = coupon.firstTimeOnly && user.orderList.length > 0;
  const categoryMismatch =
    coupon.applicableCategories.length > 0 &&
    !cartCategories.every((cat) => coupon.applicableCategories.includes(cat));
  const minOrderInvalid = cartTotal < coupon.minOrderAmount;

  // If any condition fails → coupon is invalid
  if (
    isExpired ||
    alreadyUsed ||
    firstTimeInvalid ||
    categoryMismatch ||
    minOrderInvalid
  ) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Coupon is not valid", null));
  }

  // Valid coupon
  return res
    .status(200)
    .json(new ApiResponse(200, "Coupon applied successfully", coupon));
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { products } = req.body;
  for (const product of products) {
    const productId = product._id;
    const size = product.size;
    await Product.findByIdAndUpdate(
      productId,
      { $set: { size: size } },
      { new: true }
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully update the product sizes "));
});

export {
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
};
