import api from "../api/axios";

const createRazorpayOrder = async ({ amount }) => {
  try {
    const res = await api.post("/payment/razorpay-order", { amount });
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const savePaidOrder = async ({ orderDetails, paymentData }) => {
  try {
    const res = await api.post("/order/save-paid", {
      orderDetails,
      paymentData,
    });
    console.log(res);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const getAllOrders = async (userId) => {
  try {
    const res = await api.get(`/user/orders/${userId}`);
    console.log(res.data.data);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const markCouponUsed = async ( userId, code ) => {
  try {
    console.log("code :", code, "user", userId);
    await api.put("/products/mark-used", {
      userId,
      code,
    });
  } catch (error) {
    throw error;
  }
};

const cancelOrder = async (orderId) => {
  try {
    const res = await api.post("/order/cancel-order", {
      orderId,
    });
    console.log(res);
  } catch (error) {
    throw error;
  }
};
export {
  createRazorpayOrder,
  savePaidOrder,
  getAllOrders,
  markCouponUsed,
  cancelOrder,
};
