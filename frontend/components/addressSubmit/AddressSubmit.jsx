import { useNavigate } from "react-router-dom";
import { getAllAddress } from "../../services/address.js";
import { useState, useEffect } from "react";
import useUser from "../../context/UserContext/UserContext.jsx";
import useOrder from "../../context/OrderContext/OrderContext.jsx";
import "./AddressSubmit.css";
import Loader from "../Loader/Loader.jsx";
function AddressSubmit() {
  const { order, updateOrder } = useOrder();
  const [selectedAddressId, setSelectedAddressId] = useState(
    order.addressId || null
  );
  const [allAddress, setAllAddress] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    setLoading(true);
    if (!user) {
      navigate("/login");
    }
    try {
      const data = await getAllAddress(user._id);
      setAllAddress(data);
    } catch (err) {
      console.error("Error fetching addresses", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, [user, navigate]);

  useEffect(() => {
    if (order.addressId) {
      setSelectedAddressId(order.addressId);
    }
  }, [order.addressId]);

  const handleSubmit = () => {
    if (selectedAddressId) {
      updateOrder({ addressId: selectedAddressId });
      navigate("/OrderSummery");
    } else {
      alert(`Please select address`);
    }
  };

  return (
    <div className="address-container">
      <Loader isVisible={loading} />
      <h2 className="add-address-btn" onClick={() => navigate("/addressPage")}>
        + Add New Address
      </h2>

      <div className="address-list">
        {allAddress.map((address) => (
          <div key={address._id} className="address-card">
            <input
              type="radio"
              name="address"
              id={address._id}
              value={address._id}
              checked={selectedAddressId === address._id}
              onChange={(e) => setSelectedAddressId(e.target.value)}
            />
            <label htmlFor={address._id} className="address-label">
              <p className="username">{address.username}</p>
              <p>{address.addressLine}</p>
              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>
              <p>{address.mobileNo}</p>
            </label>
          </div>
        ))}
      </div>

      <button className="continue-btn" onClick={handleSubmit}>
        Continue
      </button>
    </div>
  );
}
export default AddressSubmit;
