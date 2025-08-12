import api from "../api/axios.js";
const loginUser = async (formDate) => {
  try {
    const res = await api.post("/user/login", formDate);
    console.log(res.data);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const registerUser = async (formData) => {
  try {
    const res = await api.post("/user/register", formData);
    console.log(res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const verifyOtp = async (email, otp, context) => {
  try {
    const res = await api.post("/user/verify-otp", {
      email,
      otp,
      context,
    });
    console.log(res.data.data);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const sendOtp = async (email, username, password, context) => {
  try {
    await api.post("/user/send-otp", { email, username, password, context });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const resetPassword = async (email, password) => {
  try {
    await api.post("/user/reset-password", { email, password });
  } catch (error) {
    throw error;
  }
};

const registerThroughGoogle = async ({ token }) => {
  try {
    const res = await api.post("/user/googleLogin", { token });
    console.log(res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async (userId) => {
  try {
    const res = await api.post("/user/logout", { userId });
    console.log(res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const changeUserDetails = async (formdate) => {
  try {
    const res = await api.post("/user/edit-profile", formdate);
    console.log("Successfull");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const uploadAvatar = async (formdata) => {
  try {
    const res = await api.post("/user/upload-avatar", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export {
  loginUser,
  registerUser,
  registerThroughGoogle,
  logoutUser,
  verifyOtp,
  sendOtp,
  resetPassword,
  uploadAvatar,
  changeUserDetails,
};
