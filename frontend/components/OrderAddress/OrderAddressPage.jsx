import { useState } from "react";
import "./OrderAddressPage.css"; // Optional: if you want to style with CSS
import { useNavigate } from "react-router-dom";
import { saveUserAddress } from "../../services/address.js";
import useOrder from "../../context/OrderContext/OrderContext.jsx";
import useUser from "../../context/UserContext/UserContext.jsx";
import Loader from "../Loader/Loader.jsx";
import { showErrorToast } from "../../utiles/Toast/toast.js";
function OrderAddressPage() {
  const { user } = useUser();
  const { updateOrder } = useOrder();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: user._id,
    username: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // console.log("Form Data:", formData);
      setLoading(true);
      const res = await saveUserAddress(formData);
      // console.log(res);
      updateOrder({ addressId: res._id });
      console.log(res._id);
      navigate("/OrderSummery", { replace: true });
      // send to server or navigate to next step
    } catch (error) {
      showErrorToast("Failed to save the address");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-address-container">
      <Loader isVisible={loading} message="loading..." />
      <h2>Enter Your Shipping Details</h2>
      <form className="address-form" onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your full name"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={handleChange}
          required
        /> */}

        <label htmlFor="mobileNo">Mobile No</label>
        <input
          type="tel"
          name="mobileNo"
          id="mobileNo"
          placeholder="Enter your mobile number"
          value={formData.mobileNo}
          onChange={handleChange}
          required
        />

        <label htmlFor="address">Address</label>
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="Enter your city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <label htmlFor="state">State</label>
        <input
          type="text"
          name="state"
          id="state"
          placeholder="Enter your state"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <label htmlFor="pincode">Pincode</label>
        <input
          type="text"
          name="pincode"
          id="pincode"
          placeholder="Enter your pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />

        <button type="submit" className="placeOrder">
          Continue
        </button>
      </form>
    </div>
  );
}

export default OrderAddressPage;
