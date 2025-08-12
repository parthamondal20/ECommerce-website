import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./ProductPage.css"; // ✅ Import the CSS
import { getAllAddress } from "../../services/address.js";
import {
  getProductInfo,
  submitReview,
  getReviewList,
  deleteReview,
  getBestCoupon,
} from "../../services/product.js";
import { addProductIncart } from "../../services/cart.js";
import useUser from "../../context/UserContext/UserContext.jsx";
import useOrder from "../../context/OrderContext/OrderContext.jsx";
import { showSuccessToast, showErrorToast } from "../../utiles/Toast/toast.js";
import { useEffect, useState } from "react";
import RatingStars from "../RatingStars/RatingStars.jsx";
import Loader from "../Loader/Loader.jsx";

function ProductPage() {
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewList, setReviewList] = useState([]);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [bestCoupon, setBestCoupon] = useState(null);
  const [sizeError, setSizeError] = useState(null);
  const [comment, setComment] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const { updateOrder } = useOrder();
  const location = useLocation();
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [starCounts, setStarCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  useEffect(() => {
    fetchProductDetails();
    fetchReviewList();
  }, [productId]);

  useEffect(() => {
    document.body.style.overflow = showSizeChart ? "hidden" : "auto";
  }, [showSizeChart]);

  const fetchReviewList = async () => {
    try {
      setLoading(true);
      const list = await getReviewList(productId);
      const countStars = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };
      list.reviews.map((item) => {
        if (item.rating) {
          countStars[item.rating]++;
        }
      });
      setStarCounts(countStars);
      setReviewList(list.reviews);
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const data = await getProductInfo({ params: { productId } });
      const bestCoupon = await getBestCoupon(productId);
      console.log(bestCoupon);
      setBestCoupon(bestCoupon);
      setProduct(data);
    } catch (error) {
      showErrorToast("Failed to get the product info");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showErrorToast("Please login to add the product in the cart");
      navigate("/login", { state: { from: location.pathname }, replace: true });
      return;
    }
    if (product.category === "Shoes" && !selectedSize) {
      setSizeError("jahgsg");
      return;
    }
    setLoading(true);
    try {
      const userId = user._id;
      const productId = product._id;
      const res = await addProductIncart({
        userId,
        productId,
        size: selectedSize,
      });
      showSuccessToast(res.data.message);
    } catch (error) {
      showErrorToast(`ERROR : Failed to add product in the cart`);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderBtn = async () => {
    if (!user) {
      showSuccessToast("Please login to order product");
      navigate("/login");
      return;
    }
    if (product.category === "Shoes" && !selectedSize) {
      setSizeError("jahgsg");
      return;
    }
    try {
      setLoading(true);
      const orderData = {
        items: [{ ...product, quantity: 1, size: selectedSize }],
        totalAmount: product.price,
        paymentMethod: "cash on delivery",
        coupon: null,
      };
      localStorage.setItem("order", JSON.stringify(orderData));
      updateOrder(orderData);
      const res = await getAllAddress(user._id);
      if (!Array.isArray(res) || res.length === 0) {
        navigate("/addressPage");
      } else {
        navigate("/addressSubmit");
      }
    } catch (error) {
      console.log("the error is ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
    const payload = {
      user: user._id,
      product: productId,
      rating: userRating,
      comment: comment,
    };
    try {
      setLoading(true);
      await submitReview(payload);
      setComment("");
      setUserRating(0);
      setShowModal(false);
      await fetchReviewList();
      await fetchProductDetails();
      showSuccessToast("Review Submitted");
    } catch (error) {
      showErrorToast("Failed to submit the review");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  function handleWhatsappShare() {
    const productUrl = window.location.href; // current page URL
    const message = `Check out this product: ${product.name} - ₹${product.price}\n${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  const deleteUserReview = async (reviewId) => {
    try {
      setLoading(true);
      await deleteReview(product._id, reviewId);
      await fetchReviewList();
      await fetchProductDetails();
      showSuccessToast("Review Deleted");
    } catch (error) {
      showErrorToast("Failed to delete review");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-page">
      <Loader isVisible={loading} />
      {product && (
        <div className="product-container">
          <div className="product-top">
            <div className="main-image-container">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-info-scrollable">
              <div className="details-section">
                <h1>{product.name}</h1>
                <p className="description">{product.description}</p>
                <div className="rating-container">
                  <div className="rating-stars">⭐</div>
                  <span className="rating-number">
                    {product.reviews.length > 0 ? product.rating : 0}
                  </span>
                  <span className="rating-count">
                    ({reviewList.length} Reviews)
                  </span>
                </div>
                <p className="brand">
                  Brand: <strong>{product.brand}</strong>
                </p>
                <div className="price-section">
                  <div className="price-container">
                    <p className="price">₹{product.price}</p>
                    <span className="original-price">
                      ₹{parseInt((product.price * 100) / 70)}
                    </span>
                    <span className="discount-badge">30% OFF</span>
                  </div>
                  <p className="price-note">inclusive of all taxes</p>
                </div>

                {product.maxStocks > 0 ? (
                  <p className="stock-details">In stock</p>
                ) : (
                  <p className="stock-details-dead">Out of stock</p>
                )}

                {product.category === "Shoes" && (
                  <div className="size-section">
                    <p className="size-title">Size- UK/India</p>
                    <div className="size-grid">
                      {[6, 7, 8, 9, 10].map((size) => (
                        <p
                          key={size}
                          className={`size-number ${
                            selectedSize === size ? "selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedSize(size);
                            setSizeError(null);
                          }}
                        >
                          {size}
                        </p>
                      ))}
                      <div
                        className="size-chart"
                        onClick={() => setShowSizeChart((prev) => !prev)}
                      >
                        <span className="size-chart-title">Size Chart</span>
                        <img
                          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzOCIgaGVpZ2h0PSIxMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMyODc0RjAiIHN0cm9rZS13aWR0aD0iMS4zIj48cGF0aCBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zNy4zNS42NUguNjV2MTAuN2gzNi43Vi42NXoiLz48cGF0aCBmaWxsPSIjODc4Nzg3IiBkPSJNNi42NSA4LjY1aDF2Mi43aC0xem00LTNIMTFsLS4zNS0uMzVWNWwtLjE1LjE1LS4xNS0uMTV2LjNsLS4zNS4zNWguMzV2NS43SDEwbC4zNS4zNXYuM2wuMTUtLjE1LjE1LjE1di0uM2wuMzUtLjM1aC0uMzV2LTUuN3ptNSAzSDE2bC0uMzUtLjM1VjhsLS4xNS4xNS0uMTUtLjE1di4zbC0uMzUuMzVoLjM1djIuN0gxNWwuMzUuMzV2LjNsLjE1LS4xNS4xNS4xNXYtLjNsLjM1LS4zNWgtLjM1di0yLjd6bTQtM2gxdjUuN2gtMXptNCAzaDF2Mi43aC0xem05IDBoMXYyLjdoLTF6bS00LTNoMXY1LjdoLTF6Ii8+PC9nPjwvc3ZnPg=="
                          alt=""
                        />
                      </div>
                    </div>
                    {sizeError && (
                      <p className="size-error-msg">
                        Please enter your shoe size
                      </p>
                    )}
                  </div>
                )}

                {bestCoupon && (
                  <div className="available-offers">
                    <h3 className="offer-title">Best Offer</h3>
                    <div className="product-coupon-section">
                      <p className="offer-discount">
                        Save ₹{bestCoupon.discount} using coupon
                      </p>
                      <p className="offer-code">
                        Code: <span>{bestCoupon.code}</span>
                      </p>
                      <p className="offer-discount">
                        Add to cart to explore more offers
                      </p>
                    </div>
                  </div>
                )}

                {showSizeChart && (
                  <div
                    className="size-chart-overlay"
                    onClick={() => setShowSizeChart(false)}
                  >
                    <div
                      className="size-chart-modal"
                      onClick={(e) => e.stopPropagation()} // prevent closing on modal click
                    >
                      <div className="size-chart-header">
                        <h3>Size Chart</h3>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="coupon-list-cancelIcon"
                          onClick={() => setShowSizeChart(false)}
                        >
                          <path
                            fill="#000"
                            fillRule="evenodd"
                            d="M9.031 8l6.756-6.756a.731.731 0 0 0 0-1.031.732.732 0 0 0-1.031 0L8 6.969 1.244.213a.732.732 0 0 0-1.031 0 .731.731 0 0 0 0 1.03L6.969 8 .213 14.756a.731.731 0 0 0 0 1.031.732.732 0 0 0 1.031 0L8 9.031l6.756 6.756a.732.732 0 0 0 1.031 0 .731.731 0 0 0 0-1.03L9.031 8z"
                          />
                        </svg>
                      </div>

                      <div className="size-chart-content">
                        {/* Left Table */}
                        <table className="size-chart-table">
                          <thead>
                            <tr>
                              <th>UK/India</th>
                              <th>Length (in cm)</th>
                              <th>Brand Size</th>
                              <th>Euro</th>
                              <th>US</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>6</td>
                              <td>26.4</td>
                              <td>6</td>
                              <td>40</td>
                              <td>7</td>
                            </tr>
                            <tr>
                              <td>7</td>
                              <td>27.2</td>
                              <td>7</td>
                              <td>41</td>
                              <td>8</td>
                            </tr>
                            <tr>
                              <td>8</td>
                              <td>28</td>
                              <td>8</td>
                              <td>42</td>
                              <td>9</td>
                            </tr>
                            <tr>
                              <td>9</td>
                              <td>28.8</td>
                              <td>9</td>
                              <td>43</td>
                              <td>10</td>
                            </tr>
                            <tr>
                              <td>10</td>
                              <td>29.6</td>
                              <td>10</td>
                              <td>44</td>
                              <td>11</td>
                            </tr>
                            <tr>
                              <td>11</td>
                              <td>30.5</td>
                              <td>11</td>
                              <td>45</td>
                              <td>12</td>
                            </tr>
                            <tr>
                              <td>12</td>
                              <td>31.3</td>
                              <td>12</td>
                              <td>46</td>
                              <td>13</td>
                            </tr>
                            <tr>
                              <td>13</td>
                              <td>32.2</td>
                              <td>13</td>
                              <td>47</td>
                              <td>14</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Right Instructions */}
                        <div className="size-chart-info">
                          <p className="instructions-title">
                            Not sure about your shoe size? Follow these simple
                            steps to figure it out:
                          </p>
                          <ol className="instructions-list">
                            <li>Place your foot on a blank sheet of paper</li>
                            <li>
                              Make one marking at your longest toe and one
                              marking at the backside of your heel
                            </li>
                            <li>
                              Measure (in centimetres) the length of your foot
                              between these two markings
                            </li>
                            <li>
                              Compare the value to our measurement chart to know
                              your shoe size
                            </li>
                          </ol>
                          <img
                            src="https://rukminim2.flixcart.com/www/240/240/prod/images/sizechart/shoe-8ec9e675.jpg?q=90"
                            alt="Foot measurement guide"
                            className="size-chart-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {product.maxStocks > 0 && (
                  <div className="buttons">
                    <button onClick={handleAddToCart} className="cart-button">
                      Add to Cart
                    </button>
                    <button onClick={handleOrderBtn} className="order-button">
                      Order Now
                    </button>
                  </div>
                )}

                <button
                  className="whatsapp-share-btn"
                  onClick={handleWhatsappShare}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 448 512"
                    style={{ marginRight: "8px" }}
                  >
                    <path d="M380.9 97.1C339 55.2 283.3 32 224.1 32c-108.6 0-196.7 88.1-196.7 196.7 0 34.7 9.1 68.5 26.4 98.2L16 480l155.3-37.3c28.5 15.6 60.5 23.9 93 23.9h.1c108.6 0 196.7-88.1 196.7-196.7 0-59.2-23.1-114.9-65.2-157.8zM224.1 438.7h-.1c-27.1 0-53.8-7.2-77-20.8l-5.5-3.2-92.3 22.2 24.6-89.9-3.6-5.7c-16.5-26-25.2-56-25.2-86.9 0-89.6 72.9-162.5 162.5-162.5 43.4 0 84.1 16.9 114.8 47.6s47.6 71.4 47.6 114.8c0 89.6-72.9 162.5-162.5 162.5zm101.8-138.4c-5.6-2.8-33.1-16.3-38.3-18.2-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18.2-17.6 21.9c-3.2 3.7-6.5 4.2-12.1 1.4-33.1-16.5-54.8-29.5-76.5-66.6-5.8-10 5.8-9.3 16.5-30.9 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.3 18.8-19.3 45.9 0 27.1 19.8 53.2 22.5 56.9 2.8 3.7 38.9 59.4 94.2 83.2 13.1 5.6 23.3 8.9 31.3 11.4 13.1 4.2 25 3.6 34.4 2.2 10.5-1.6 33.1-13.5 37.8-26.5 4.6-13 4.6-24.1 3.2-26.5-1.3-2.3-5.1-3.7-10.6-6.5z" />
                  </svg>
                  Share on WhatsApp
                </button>
              </div>

              <div className="review-section">
                <h2>Ratings & Reviews</h2>
                <div className="average-rating">
                  <h1>{product.rating}★</h1>
                  <p>{reviewList.length} Reviews</p>
                </div>

                <div className="rating-breakdown">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div className="bar" key={star}>
                      <span>{star}★</span>
                      <div className="progress">
                        {starCounts[star] > 0 && (
                          <div
                            className="progress-fill"
                            style={{
                              width: `${
                                (starCounts[star] / reviewList.length) * 100
                              }%`,
                              backgroundColor: star > 2 ? "green" : "red",
                            }}
                          />
                        )}
                      </div>
                      <span>{starCounts[star]}</span>
                    </div>
                  ))}
                </div>
                <div className="rating-btn-position">
                  <button
                    onClick={() => setShowModal(true)}
                    className="rating-btn"
                  >
                    Rate Product
                  </button>
                </div>
                {showModal && (
                  <div className="review-form-modal">
                    <div className="modal-content">
                      <h3>Rate this Product</h3>
                      <div className="rating-input">
                        <label>Your Rating</label>
                        <RatingStars
                          rating={userRating}
                          onChange={setUserRating}
                        />
                      </div>
                      <div className="comment-input">
                        <label>Your Review</label>
                        <textarea
                          placeholder="Write your experience"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <div className="modal-buttons">
                        <button
                          className="cancel-btn"
                          onClick={() => {
                            setShowModal(false);
                            setUserRating(0);
                            setComment("");
                          }}
                        >
                          Cancel
                        </button>
                        {userRating > 0 && (
                          <button
                            className="submit-btn"
                            onClick={handleReviewSubmit}
                          >
                            Submit review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="reviews-list">
                  {reviewList.length > 0
                    ? reviewList.map((review, index) => (
                        <div className="review-card" key={index}>
                          {review.user._id === user._id && (
                            <button
                              className="delete-review-btn"
                              onClick={() => deleteUserReview(review._id)}
                            >
                              Delete
                            </button>
                          )}
                          <div className="reviewer-info">
                            <img
                              className="reviewer-avatar"
                              src={review.user.avatar}
                              alt={review.user.username}
                            />
                            <strong>
                              {review.user?.username || "Anonymous"}
                            </strong>
                          </div>
                          <div className="stars">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                          <p>{review.comment}</p>
                          <small>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      ))
                    : !loading && <p className="no-reviews">No reviews yet.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
