import "./OrderSuccessPage.css";
import { useNavigate } from "react-router-dom";
import useOrder from "../../context/OrderContext/OrderContext";
export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { order } = useOrder();
  return (
    <div className="success-container">
      <div className="success-icon">✅</div>
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for shopping with us.</p>
      <p>
        Your Order ID: <strong>{order._id}</strong>
      </p>
      {order.coupon && <p>You saved {order.coupon.discount} on this order</p>}
      <div className="success-buttons">
        <button onClick={() => navigate("/orders")}>View My Orders</button>
        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    </div>
  );
}
