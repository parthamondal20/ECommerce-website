import api from "../api/axios";
const getUserCartList = async (userId) => {
  try {
    const res = await api.get(`/user/myCart/${userId}`);

    console.log(res);
    return res.data.data;
  } catch (error) {
    console.log(error);
    console.log(`Failed to fetch the cartList of the user`);
  }
};

const addProductIncart = async (info) => {
  try {
    const res = await api.post(`/products/addToCart`, info);
    return res;
  } catch (error) {
    throw error;
  }
};

const removeFromCart = async (userId, productId) => {
  try {
    const res = await api.delete(`/user/myCart/remove/${userId}/${productId}`);
    console.log(res);
  } catch (error) {
    throw error;
  }
};

const updateCartQuantity = async (productId, userId, quantity) => {
  try {
    const res = await api.put("/user/update-cart-quantity", {
      productId,
      userId,
      quantity,
    });
    console.log(res);
  } catch (error) {
    throw error;
  }
};

const getAllCoupons = async (userId, cartList) => {
  try {
    const res = await api.post(`/products/coupons/${userId}`, {
      cartItems: cartList,
    });
    // console.log(res.data);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const getSearchCoupon = async (code, cartItems,userId) => {
  try {
    const res = await api.post("/products/check-coupon", {
      code,
      cartItems,
      userId
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
export {
  getUserCartList,
  addProductIncart,
  removeFromCart,
  updateCartQuantity,
  getAllCoupons,
  getSearchCoupon,
};
