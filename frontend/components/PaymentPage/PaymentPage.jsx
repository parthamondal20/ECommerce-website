import { useEffect, useState } from "react";
import useOrder from "../../context/OrderContext/OrderContext";
import "./PaymentPage.css";
import { createRazorpayOrder, savePaidOrder } from "../../services/order.js";
import useUser from "../../context/UserContext/UserContext";
import { markCouponUsed } from "../../services/order.js";
import {
  updateProductStocks,
  updateProductDetails,
} from "../../services/product.js";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { showErrorToast, showSuccessToast } from "../../utiles/Toast/toast.js";
function PaymentPage() {
  const { order, updateOrder } = useOrder();
  const [paymentMethod, setPaymentMod] = useState("cash on delivery");
  const { user } = useUser();
  const navigate = useNavigate();
  const method = paymentMethod || "cash on delivery";
  const [loading, setloading] = useState(false);

  useEffect(() => {
    updateOrder({ paymentMod: paymentMethod });
  }, [paymentMethod]);

  const updateProductSizes = async () => {
    try {
      setloading(true);
      await updateProductDetails(order.items);
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong");
    } finally {
      setloading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setloading(true);
      const data = await createRazorpayOrder({
        amount: order.totalAmount,
      });

      // const methodOptions = {
      //   card: false,
      //   upi: false,
      //   netbanking: false,
      //   wallet: false,
      // };

      // if (paymentMethod === "Card") {
      //   methodOptions.card = true;
      // } else if (paymentMethod === "Netbanking") {
      //   methodOptions.netbanking = true;
      // } else if (paymentMethod === "UPI") {
      //   methodOptions.upi = true;
      // } else if (paymentMethod === "Wallet") {
      //   methodOptions.wallet = true;
      // } else {
      //   methodOptions.card =
      //     methodOptions.upi =
      //     methodOptions.netbanking =
      //     methodOptions.wallet =
      //       true;
      // }

      // console.log("this is data", data);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "My E-Commerce Website",
        description: "Test Payment",
        image: "example.com/image/rzp.jpg",
        order_id: data.id,
        handler: async function (response) {
          try {
            // console.log("handler", response);
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            const orderDetails = {
              userId: user._id,
              items: order.items,
              amount: order.totalAmount,
              paymentMethod: paymentMethod,
              addressId: order.addressId,
              deliveryBy: "5-7 days",
            };
            console.log("orderDetails", orderDetails);
            console.log("paymentdata", paymentData);
            await savePaidOrder({ orderDetails, paymentData });
            showSuccessToast("SuccessFully order placed");
            // alert(response.razorpay_payment_id);
            navigate("/OrderSuccess", { replace: true });
            if (order.coupon) {
              await markCouponUsed(user._id, order.coupon?.code);
              updateOrder({ ...order, coupon: null });
              localStorage.setItem(
                "order",
                JSON.stringify({ ...order, coupon: null })
              );
            }
            await updateProductSizes();
            await updateProductStocks(order.items);
          } catch (error) {
            console.log(error);
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
          contact: "9999999999",
        },
        // method: methodOptions,
        theme: {
          color: "#3399cc",
        },
      };
      console.log("Order id:", data.id);
      console.log("this is options", options);
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response);

        const message = `
        ❌ Payment Failed!
        Code: ${response.error.code}
        Reason: ${response.error.reason}
        Description: ${response.error.description}
        Source: ${response.error.source}
        Step: ${response.error.step}
        Order ID: ${response.error.metadata?.order_id}
        Payment ID: ${response.error.metadata?.payment_id}
      `;

        console.log(message); // Show toast or use modal/dialog
      });

      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      console.log(paymentMethod);
      alert("Something went wrong during payment");
    } finally {
      setloading(false);
    }
  };

  const handleOrder = async () => {
    if (!order?.items?.length || !order?.addressId || !order?.totalAmount) {
      showErrorToast(
        "Order is incomplete. Please check your cart and address."
      );
      console.log(order);
      return;
    }
    if (method === "cash on delivery") {
      setloading(true);
      try {
        const orderDetails = await savePaidOrder({
          orderDetails: {
            userId: user._id,
            items: order.items,
            amount: order.totalAmount,
            paymentMethod: method,
            addressId: order.addressId,
            deliveryBy: "5-7 days",
          },
          paymentData: {
            razorpay_payment_id: null,
            razorpay_order_id: null,
            razorpay_signature: null,
          },
        });
        // console.log(order.items);
        // console.log(orderDetails);
        order._id = orderDetails._id;
        if (order.coupon) {
          await markCouponUsed(user._id, order.coupon?.code);
          updateOrder({ ...order, coupon: null });
          localStorage.setItem(
            "order",
            JSON.stringify({ ...order, coupon: null })
          );
        }
        await updateProductSizes();
        // localStorage.removeItem("order");
        navigate("/OrderSuccess", { replace: true });
      } catch (error) {
        showErrorToast("somehting went wrong ! Failed to place the order");
        console.log(error);
      } finally {
        setloading(false);
      }
    } else {
      await handleRazorpayPayment();
    }
  };

  return (
    <div className="payment-section">
      <Loader isVisible={loading} />
      <h1>Enter your Payment details</h1>
      <h2>Select Your Payment Method</h2>
      <select
        className="payment-select"
        value={paymentMethod}
        onChange={(e) => setPaymentMod(e.target.value)}
      >
        <option value="cash on delivery">Cash on Delivery</option>
        <option value="Razorpay">Razorpay</option>
{/*         <option value="Card">Credit / Debit Card</option>
        <option value="Wallet">Wallet</option>
        <option value="Netbanking">Netbanking</option> */}
      </select>

      <div className="payment-summary">
        <p>
          <strong>Selected:</strong> {paymentMethod}
        </p>
      </div>

      <button onClick={handleOrder} className="payment-button">
        Place Order
      </button>
    </div>
  );
}
export default PaymentPage;
