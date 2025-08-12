import api from "../api/axios.js";
const getAllAddress = async (userId) => {
  try {
    const res = await api.get(`/user/address/${userId}`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

const saveUserAddress = async (formData) => {
  try {
    const res = await api.post("/user/save-address", formData);
    console.log(res.data);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export { getAllAddress, saveUserAddress };
