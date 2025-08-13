import api from "../api/axios";

const getAllProducts = async (category = "", sort = "", query = "") => {
  try {
    const res = await api.get(`/products`, {
      params: {
        category,
        sort,
        query,
      },
    });
    // console.log(res.data);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const getProductInfo = async ({ params }) => {
  try {
    const res = await api.get(`/products/product-details/${params.productId}`);
    return res.data.data;
  } catch (error) {
    console.log("failed to fetch data");
  }
};

const getProductSuggestions = async (input) => {
  try {
    const res = await api.get("/products/suggestions", {
      params: { query: input },
    });
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};

const submitReview = async (payload) => {
  try {
    await api.post("/products/submit-review", payload);
  } catch (error) {
    throw error;
  }
};
const getReviewList = async (productId) => {
  try {
    const res = await api.get(`/products/review-list/${productId}`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
const deleteReview = async (productId, reviewId) => {
  try {
    await api.delete(`/products/review/${productId}/${reviewId}`);
  } catch (error) {
    throw error;
  }
};

const updateProductStocks = async (products) => {
  try {
    await api.put("/products/update-stocks", {
      products,
    });
    console.log("Successfully updated the products");
  } catch (error) {
    throw error;
  }
};
const getBestCoupon = async (productId) => {
  try {
    const res = await api.get(`/products/best-coupon/${productId}`);
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const updateProductDetails = async (products) => {
  try {
    const res = await api.put("/products/update-product-details", {
      products,
    });
    console.log(res);
  } catch (error) {
    throw error;
  }
};

export {
  getAllProducts,
  getProductInfo,
  getProductSuggestions,
  submitReview,
  getReviewList,
  deleteReview,
  updateProductStocks,
  getBestCoupon,
  updateProductDetails,
};
