import { useEffect, useState } from "react";
import useOrder from "../../context/OrderContext/OrderContext.jsx";
import useUser from "../../context/UserContext/UserContext.jsx";
import { getAllAddress } from "../../services/address.js";
import "./OrderSummeryPage.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader.jsx";

function OrderSummeryPage() {
  const { order, updateOrder } = useOrder();
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        if (user?._id && order?.addressId) {
          // const allAddress = await getAllAddress(user._id);
          const [allAddress] = await Promise.all([
            getAllAddress(user._id),
            new Promise((resolve) => setTimeout(resolve, 1000)), // wait at least 2s
          ]);
          const selected = allAddress.find(
            (add) => add._id === order.addressId
          );
          setAddress(selected);
        }
      } catch (error) {
        console.log("Failed to fetch the address details", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchDetails();
    }
  }, [user, order.addressId]);

  // Check if order and order.items exist before processing
  if (!order || !order.items) {
    return <h1>No order data available</h1>;
  }

  const normalizedItems = order.items.map((item, index) => {
    const product = item.product || item;
    return {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      quantity: item.quantity || 1,
      size: product.size || null,
    };
  });

  const totalPrice = normalizedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleNext = () => {
    const discount = order.coupon?.discount || 0;
    updateOrder({ totalAmount: totalPrice - discount });
    navigate("/PaymentPage");
  };

  return (
    <div className="paymentPage">
      <div className="section">
        <h2>Deliver to:</h2>
        {address ? (
          <div className="address-details">
            <p>
              <strong>{address.username}</strong>
            </p>
            <p>
              {address.addressLine}, {address.city}, {address.state},{" "}
              {address.pincode}
            </p>
            <p>{address.mobileNo}</p>
          </div>
        ) : (
          !loading && <p>Address not found.</p>
        )}
      </div>

      <div className="section">
        <h2>Order details</h2>
        {normalizedItems.map((item) => (
          <div className="order-item" key={item._id}>
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <p>{item.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>
              {item.size && <p>Size:{item.size}</p>}
            </div>
          </div>
        ))}
        <div className="total-price">
          <p>Total: ₹{totalPrice}</p>
          {order.coupon && <p> Coupon discount: ₹{order.coupon.discount}</p>}
          {order.coupon && (
            <p>Final price: ₹{totalPrice - order.coupon.discount}</p>
          )}
        </div>
      </div>
      <button onClick={handleNext}>Proceed to Pay</button>
      <Loader isVisible={loading} />
    </div>
  );
}

export default OrderSummeryPage;
