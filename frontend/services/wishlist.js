import api from "../api/axios";
const getWishlist = async (userId) => {
  try {
    const res = await api.get(`/products/myWishlist/${userId}`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const addProductToWishList = async ({ productId, userId }) => {
  try {
    const res = await api.post("/products/addToWishlist", {
      productId,
      userId,
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const removeProductFromWishlist = async (productId, userId) => {
  try {
    await api.post("/products/removeFromWishlist", { productId, userId });
  } catch (error) {
    throw error;
  }
};

export { getWishlist, addProductToWishList, removeProductFromWishlist };
