import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Cart.css";
import { getAllAddress } from "../../services/address.js";
import {
  getUserCartList,
  removeFromCart,
  getAllCoupons,
  updateCartQuantity,
  getSearchCoupon,
} from "../../services/cart.js";
import { showErrorToast, showSuccessToast } from "../../utiles/Toast/toast.js";
import useUser from "../../context/UserContext/UserContext.jsx";
import Loader from "../Loader/Loader.jsx";
import useOrder from "../../context/OrderContext/OrderContext.jsx";
function Cart() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cartList, setCartList] = useState([]);
  const [bestValidCoupon, setBestCoupon] = useState(null);
  const [allValidCoupon, setAllValidCoupon] = useState([]);
  const [allNearlyEligibleCoupon, setAllNearlyEligibleCoupon] = useState([]);
  const [searchCoupon, setSearchCoupon] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [maxSaving, setMaxSaving] = useState(0);
  const [showApplyBtn, setShowApplyBtn] = useState(true);
  const [searchBoxText, setSearchBoxText] = useState("");
  const [showCouponlist, setShowCouponlist] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [loading, setLoading] = useState(true);
  const { order, updateOrder } = useOrder();
  const location = useLocation();
  const handlePlaceOrder = async () => {
    try {
      const res = await getAllAddress(user._id);
      updateOrder({
        ...order,
        totalAmount: cartTotal - maxSaving,
        items: cartList,
      });
      order.items = cartList;
      if (res.length === 0) {
        navigate("/addressPage");
      } else {
        navigate("/addressSubmit");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //fetching the cartlist products

  const fetchCartListProducts = async () => {
    setLoading(true);
    try {
      const cart = await getUserCartList(user._id);
      console.log(cart);
      const rawTotal = cart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setCartTotal(rawTotal);
      setCartList(cart);
      const { bestCoupon, validCoupons, nearlyEligible } = await getAllCoupons(
        user._id,
        cart
      );
      setBestCoupon(bestCoupon);
      setAllValidCoupon(validCoupons);
      setAllNearlyEligibleCoupon(nearlyEligible);
      setCartLength(cart.reduce((acc, item) => acc + item.quantity, 0));
      const newOrder = JSON.parse(localStorage.getItem("order"));
      updateOrder(newOrder);
      if (newOrder) {
        if (newOrder.coupon) {
          if (newOrder.coupon.code === bestCoupon?.code) {
            setBestCoupon(newOrder.coupon);
            setShowApplyBtn(false);
          } else {
            setAppliedCoupon(newOrder.coupon);
          }
          setMaxSaving(newOrder.coupon.discount);
        }
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showCouponlist ? "hidden" : "auto";
  }, [showCouponlist]);

  useEffect(() => {
    if (!user) {
      showErrorToast("Please login to see the cart section");
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      await fetchCartListProducts();
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCartLength(cartList.reduce((acc, item) => acc + item.quantity, 0));
    setCartTotal(
      cartList.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      )
    );

    const fetchCoupons = async () => {
      try {
        console.log(cartList);
        const data = await getAllCoupons(user._id, cartList);
        // console.log(data);
        const { bestCoupon, validCoupons, nearlyEligible } = data;
        setBestCoupon(bestCoupon);
        setAllValidCoupon(validCoupons);
        setAllNearlyEligibleCoupon(nearlyEligible);
      } catch (error) {
        console.log(error);
        showErrorToast("Something went wrong");
      }
    };
    fetchCoupons();
  }, [cartList, location]);

  const handleRemoveProduct = async (product) => {
    try {
      setLoading(true);
      const userId = user._id;
      const productId = product.product._id;
      await removeFromCart(userId, productId);
      setCartList((prevProducts) =>
        prevProducts.filter((item) => item.product._id !== productId)
      );
      setCartTotal(cartTotal - product.product.price * product.quantity);
      showSuccessToast("Product removed from cart");
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong!Please try again");
    } finally {
      setLoading(false);
      setShowRemoveConfirm(false);
      setProductToRemove(null);
    }
  };

  const updateProductQuantity = async (item, context) => {
    const userId = user._id;
    const productId = item.product._id;
    const quantity = item.quantity;
    try {
      if (context === "Decrease") {
        await updateCartQuantity(productId, userId, quantity - 1);
        setCartList((prevProducts) =>
          prevProducts
            .map((item) =>
              item.product._id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
      } else {
        await updateCartQuantity(productId, userId, quantity + 1);
        setCartList((prevProducts) =>
          prevProducts.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } catch (error) {
      showErrorToast("Something went wrong!Please try again");
      console.log(error);
    }
  };

  const handleCouponApply = () => {
    setMaxSaving(bestValidCoupon.discount);
    updateOrder({ ...order, coupon: bestValidCoupon });
    localStorage.setItem("order", JSON.stringify(order));
    setAppliedCoupon(null);
    setShowApplyBtn((prev) => !prev);
    showSuccessToast("Coupon Applied🎉");
  };

  const handleCouponRemove = () => {
    setMaxSaving(0);
    updateOrder({ ...order, coupon: null });
    localStorage.setItem("order", JSON.stringify(order));
    setShowApplyBtn((prev) => !prev);
  };

  const handleCouponApplyBtn = () => {
    updateOrder({ ...order, coupon: appliedCoupon || null });
    localStorage.setItem("order", JSON.stringify(order));
    setMaxSaving(appliedCoupon?.discount || 0);
    showSuccessToast("Coupons Applied🎉");
    setShowCouponlist(false);
    setShowApplyBtn(true);
  };

  const handleCheckBtn = async () => {
    try {
      setLoading(true);
      const requestCoupon = await getSearchCoupon(
        searchBoxText,
        cartList,
        user._id
      );
      console.log(requestCoupon);
      if (!requestCoupon) {
        setCouponError(
          "Sorry, this coupon is not valid for this user account."
        );
      } else {
        setSearchCoupon(requestCoupon);
        setCouponError(null);
      }
    } catch (error) {
      showErrorToast("Something Went Wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (product) => {
    setProductToRemove(product);
    setShowRemoveConfirm(true);
  };

  const cancelRemoveProduct = () => {
    setShowRemoveConfirm(false);
    setProductToRemove(null);
  };

  return (
    <div>
      <Loader isVisible={loading} />
      {showRemoveConfirm && (
        <div className="remove-confirm-overlay">
          <div className="remove-confirm-modal">
            <h3>Remove Product</h3>
            <p>
              Are you sure you want to remove{" "}
              <strong>{productToRemove?.product?.name}</strong> from your cart?
            </p>
            <div className="remove-confirm-actions">
              <button
                className="confirm-btn"
                onClick={() => handleRemoveProduct(productToRemove)}
              >
                Yes, Remove
              </button>
              <button className="cancel-btn" onClick={cancelRemoveProduct}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {cartList.length > 0 ? (
        <>
          <div className="cart-container">
            <h1 className="cart-title">🛒 Your Cart</h1>
            <div className="cart-list">
              {cartList.map((product, index) => (
                <div className="cart-item" key={index}>
                  <img
                    src={
                      product.product.image || "https://via.placeholder.com/120"
                    }
                    alt={product.product.name}
                    onClick={() => navigate(`/product/${product.product._id}`)}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h2
                      onClick={() =>
                        navigate(`/product/${product.product._id}`)
                      }
                      className="product-name"
                    >
                      {product.product.name}
                    </h2>
                    <p className="product-brand">
                      Brand: {product.product.brand}
                    </p>
                    <p className="product-price">
                      Price: ₹{product.product.price}
                    </p>
                    {product.product.size && (
                      <p className="product-size">
                        Size:{product.product.size}
                      </p>
                    )}
                    <div className="quantity-control">
                      <button
                        disabled={product.quantity < 2}
                        onClick={() =>
                          updateProductQuantity(product, "Decrease")
                        }
                        className="minus"
                      >
                        -
                      </button>
                      <span className="item-quantity">{product.quantity}</span>
                      <button
                        onClick={() =>
                          updateProductQuantity(product, "Increase")
                        }
                        className="plus"
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-actions">
                      <button
                        onClick={() => handleRemoveClick(product)}
                        className="removeBtn"
                      >
                        Remove
                      </button>
                      <button
                        className="buyBtn"
                        onClick={() => navigate("/addressSubmit")}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                Total ({cartLength} Items): ₹{cartTotal}
              </div>
            </div>
          </div>

          <div className="coupon-section">
            <div className="bestcoupon-section">
              {bestValidCoupon && (
                <div className="coupon-message">
                  <span className="coupon-label">Best Coupon:</span>
                  <span className="coupon-code">{bestValidCoupon.code}</span>
                  <span className="coupon-discount">
                    - Save ₹{bestValidCoupon.discount}
                  </span>
                  {!showApplyBtn && (
                    <span className="coupon-applied-msg">Applied</span>
                  )}
                </div>
              )}
              {bestValidCoupon && (
                <button
                  className={`apply-coupon-btn ${
                    showApplyBtn ? "apply" : "remove"
                  }`}
                  onClick={
                    showApplyBtn ? handleCouponApply : handleCouponRemove
                  }
                >
                  {showApplyBtn ? "Apply Coupon" : "Remove Coupon"}
                </button>
              )}
            </div>
            <div>
              <div className="apply-more-coupon-section">
                <p>
                  <strong>Apply coupons</strong>
                </p>
                <button
                  className="apply-btn"
                  onClick={() => setShowCouponlist((prev) => !prev)}
                >
                  {!appliedCoupon ? "Apply" : "Edit"}
                </button>
              </div>
            </div>
            <div className="price-details">
              <p>
                <span>Total price:</span>
                <span>₹{cartTotal}</span>
              </p>
              <p>
                <span>Coupon discount:</span>
                {maxSaving > 0 ? (
                  <span>-₹{maxSaving}</span>
                ) : (
                  <span
                    className="apply-coupon"
                    onClick={() => setShowCouponlist(true)}
                  >
                    Apply Coupon
                  </span>
                )}
              </p>
              <hr />
              <p className="final-price">
                <span>Final price:</span>
                <span>₹{cartTotal - maxSaving}</span>
              </p>
            </div>
          </div>
          {showCouponlist && (
            <div className="coupon-overlay">
              <div className="coupon-list">
                <div className="coupon-list-heading">
                  <h3>APPLY COUPONS</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="coupon-list-cancelIcon"
                    onClick={() => setShowCouponlist(false)}
                  >
                    <path
                      fill="#000"
                      fillRule="evenodd"
                      d="M9.031 8l6.756-6.756a.731.731 0 0 0 0-1.031.732.732 0 0 0-1.031 0L8 6.969 1.244.213a.732.732 0 0 0-1.031 0 .731.731 0 0 0 0 1.03L6.969 8 .213 14.756a.731.731 0 0 0 0 1.031.732.732 0 0 0 1.031 0L8 9.031l6.756 6.756a.732.732 0 0 0 1.031 0 .731.731 0 0 0 0-1.03L9.031 8z"
                    />
                  </svg>
                </div>

                <div className="manual-coupon-section">
                  <input
                    type="text"
                    placeholder="Enter your coupon"
                    value={searchBoxText}
                    onChange={(e) => setSearchBoxText(e.target.value)}
                    id="manual-coupon"
                    className="manual-coupon-inputbox"
                  />
                  <label
                    htmlFor="manual-coupon"
                    className={`manual-coupon-btn ${
                      !searchBoxText.trim() ? "disable" : ""
                    }`}
                    onClick={() => {
                      if (searchBoxText) {
                        handleCheckBtn();
                      }
                    }}
                  >
                    CHECK
                  </label>
                </div>

                {couponError && (
                  <p className="coupon-error-msg">{couponError}</p>
                )}
                {allValidCoupon.length > 0 &&
                  !searchCoupon &&
                  allValidCoupon.map(
                    (coupon, index) =>
                      !bestValidCoupon ||
                      (coupon._id !== bestValidCoupon._id && (
                        <div className="valid-coupon" key={index}>
                          <input
                            type="checkbox"
                            id={`coupon-${index}`}
                            checked={appliedCoupon?.code === coupon.code}
                            className={`checkbox-option ${
                              (appliedCoupon &&
                                appliedCoupon.code !== coupon.code) ||
                              !showApplyBtn
                                ? "disable"
                                : ""
                            } `}
                            disabled={
                              (appliedCoupon &&
                                appliedCoupon.code !== coupon.code) ||
                              !showApplyBtn
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAppliedCoupon(coupon);
                                setMaxSaving(coupon.discount);
                              } else {
                                setAppliedCoupon(null);
                                setMaxSaving(0);
                              }
                            }}
                          />
                          <label
                            htmlFor={`coupon-${index}`}
                            className={`coupon-code ${
                              (appliedCoupon &&
                                appliedCoupon.code !== coupon.code) ||
                              !showApplyBtn
                                ? "disable"
                                : ""
                            }`}
                          >
                            <span>{coupon.code}</span>
                          </label>
                          <div className="coupon-details">
                            <p>Save ₹{coupon.discount}</p>
                            <p>{coupon.description}</p>
                            <p>
                              Expires on:{" "}
                              {new Date(coupon.expirey).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}{" "}
                              | 11:59 PM
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                {allNearlyEligibleCoupon.length > 0 && !searchCoupon && (
                  <>
                    <p className="unlock-coupon">Unlock coupons</p>
                    {allNearlyEligibleCoupon.map(
                      (coupon, index) =>
                        !bestValidCoupon ||
                        (coupon._id !== bestValidCoupon._id && (
                          <div className="valid-coupon" key={index}>
                            <input
                              type="checkbox"
                              id={`coupon-${index}`}
                              className="checkbox-option disable"
                              disabled
                            />
                            <label
                              htmlFor={`coupon-${index}`}
                              className={`coupon-code disable`}
                            >
                              <span>{coupon.code}</span>
                            </label>
                            <div className="coupon-details">
                              <p>
                                Add products worth ₹{coupon.missingAmount} more
                                to unlock this coupon
                              </p>
                              <p>{coupon.description}</p>
                              <p>
                                Expires on:{" "}
                                {new Date(coupon.expirey).toLocaleDateString(
                                  "en-IN",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}{" "}
                                | 11:59 PM
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </>
                )}

                {searchCoupon && (
                  <div className="valid-coupon searched-coupon">
                    <input
                      type="checkbox"
                      id="searched-coupon"
                      className="checkbox-option"
                      checked
                    />
                    <label htmlFor="searched-coupon" className="coupon-code">
                      <span>{searchCoupon.code}</span>
                    </label>
                    <div className="coupon-details">
                      <p>{searchCoupon.description}</p>
                      <p>
                        Expires on:{" "}
                        {new Date(searchCoupon.expirey).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}{" "}
                        | 11:59 PM
                      </p>
                    </div>
                  </div>
                )}

                <div className="coupon-list-footer">
                  <p className="maxsaving-msg">
                    Maximum saving : ₹{appliedCoupon?.discount || 0}
                  </p>
                  <button
                    onClick={handleCouponApplyBtn}
                    className={`apply-btn ${
                      allValidCoupon.length === 0 || !appliedCoupon
                        ? "disable"
                        : ""
                    }`}
                    disabled={
                      (allValidCoupon.length === 0 || !appliedCoupon) &&
                      !searchCoupon
                    }
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="placeOrder-container">
            <button className="placeOrder" onClick={handlePlaceOrder}>
              Proceed to checkout
            </button>
          </div>
        </>
      ) : (
        !loading && (
          <div className="partha-empty-cart-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
              alt="empty-cart"
              className="partha-empty-cart-img"
            />
            <h2 className="partha-empty-cart-title">Missing your cart?</h2>
            <p className="partha-empty-cart-desc">
              Start shopping and discover great deals!
            </p>
            <button
              className="partha-empty-cart-btn"
              onClick={() => navigate("/")}
            >
              🎁 Continue Shopping
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Cart;
