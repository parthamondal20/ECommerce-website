import { createContext, useState, useContext, useEffect } from "react";
export const OrderContext = createContext(null);
export function OrderContextProvider({ children }) {
  const [order, setOrder] = useState({
    _id: null,
    items: [],
    addressId: null,
    paymentMethod: "cash on delivary",
    totalAmount: null,
    coupon: null,
  });
  const updateOrder = (data) => {
    setOrder((prev) => ({ ...prev, ...data }));
  };
  useEffect(() => {
    const saved = localStorage.getItem("order");
    if (saved) {
      try {
        updateOrder(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse order:", err);
      }
    }
  }, []);
  useEffect(() => {
    if (order && order.items.length > 0) {
      localStorage.setItem("order", JSON.stringify(order));
    }
  }, [order]);

  const OrderProvider = OrderContext.Provider;
  return (
    <OrderProvider value={{ order, updateOrder }}>{children}</OrderProvider>
  );
}

export default function useOrder() {
  return useContext(OrderContext);
}
