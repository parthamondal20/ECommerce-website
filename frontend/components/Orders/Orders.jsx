import { useState, useEffect } from "react";
import useUser from "../../context/UserContext/UserContext";
import "./Orders.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { getAllOrders, cancelOrder } from "../../services/order";
import { showSuccessToast, showErrorToast } from "../../utiles/Toast/toast";
function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const fetchOrders = async () => {
    setLoading(true); // start loading
    try {
      const data = await getAllOrders(user._id);
      console.log(data);
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showErrorToast("Something went wrong");
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true);
      await cancelOrder(orderId);
      fetchOrders();
      showSuccessToast("Order cancelled");
    } catch (error) {
      showErrorToast("Failed to cancel the Order");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="orders-section">
      <Loader isVisible={loading} />
      {orders.length > 0 ? (
        <>
          <h2 className="orders-title">Your Orders</h2>
          {orders.map((item, index) => (
            <div key={index} className="order-card">
              <h2>Deliver to:</h2>
              <div className="address-details">
                <p>
                  <strong>{item.address.username}</strong>
                </p>
                <p>
                  {item.address.addressLine}, {item.address.city},{" "}
                  {item.address.state}, {item.address.pincode}
                </p>
                <p>📞 {item.address.mobileNo}</p>
              </div>

              <div className="product-summary">
                <h3>🛒 Items:</h3>
                {item.productDetails.map((prod) => (
                  <div
                    key={prod.product._id}
                    className="order-item"
                    onClick={() => navigate(`/product/${prod.product._id}`)}
                  >
                    <img src={prod.product.image} alt={prod.product.name} />
                    <div className="product-info">
                      <p>{prod.product.name}</p>
                      <p>Qty: {prod.quantity}</p>
                      <p>Price: ₹{prod.product.price}</p>
                      {prod.product.size && <p>Size:{prod.product.size}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-details">
                <p>Order ID: {item._id}</p>
                <p>
                  Ordered on:{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-IN")}
                </p>
                <p>📍Delivery Status: {item.status}</p>
                {item.status !== "cancelled" && (
                  <p>🚚 Delivery by: {item.deliveryBy}</p>
                )}
                <p>💳 Payment method: {item.paymentMethod}</p>
                <p>💳 Payment status: {item.paymentDetails.paymentStatus}</p>
                <p>💰 Total: ₹{item.amount}</p>

                {/* ✅ Cancel button */}
                {item.status !== "cancelled" && item.status !== "delivered" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => setCancelOrderId(item._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
              {cancelOrderId === item._id && (
                <div className="cancel-confirmation">
                  <div className="cancel-card">
                    <h3>Cancel Order</h3>
                    <p>Are you sure you want to cancel this order?</p>
                    <div className="cancel-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => setCancelOrderId(null)}
                      >
                        Back
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => {
                          handleCancelOrder(item._id);
                          setCancelOrderId(null);
                        }}
                      >
                        Confirm Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        !loading && (
          <div className="no-order">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="No orders"
              className="no-orders-img"
            />
            <h2>You haven't placed any orders yet</h2>
            <p className="no-orders-subtext">
              Start shopping and discover great deals!
            </p>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              🛍️ Continue Shopping
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Orders;
