import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import {
  getWishlist,
  removeProductFromWishlist,
} from "../../services/wishlist.js";
import { addProductIncart } from "../../services/cart.js";
import useUser from "../../context/UserContext/UserContext";
import { showErrorToast, showSuccessToast } from "../../utiles/Toast/toast";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [wishlistLoading, setWishlistLoading] = useState(null);
  const navigate = useNavigate();
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const Updatedwishlist = await getWishlist(user._id);
      setWishlist(Updatedwishlist);
    } catch (error) {
      showErrorToast("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user, wishlistLoading]);

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      const userId = user._id;
      await removeProductFromWishlist(productId, userId);
      let newWishlist = wishlist.filter((product) => product._id !== productId);
      console.log(wishlist);
      setWishlistLoading(Date.now());
      setWishlist(newWishlist);
       showSuccessToast("Product removed from wishlist");
    } catch (error) {
      showErrorToast("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const userId = user._id;
      await addProductIncart({ userId, productId });
      showSuccessToast("Product added to cart");
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong");
    }
  };

  return (
    <div className="wishlist">
      <Loader isVisible={loading} />
      {wishlist && wishlist.length > 0 ? (
        <>
          <h2>
            <strong>My Wishlist : {wishlist.length} items</strong>
          </h2>
          <div className="wishlist-product">
            {wishlist.map((item) => (
              <div
                className="wishlist-item"
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                />
                <p>
                  <strong>{item.name}</strong>
                </p>
                <p>
                  <strong>₹{item.price}</strong>
                </p>
                <button
                  className="wishlist-addToCart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item._id);
                  }}
                >
                  Add to cart
                </button>
                <button
                  className="wishlist-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(item._id);
                  }}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <div className="partha-empty-wishlist-container">
            <img
              src="https://harshcreation.com/images/emptywishlist.jpg"
              alt="empty-wishlist"
              className="partha-empty-wishlist-img"
            />
            <h2 className="partha-empty-wishlist-title">
              Your wishlist is empty!
            </h2>
            <p className="partha-empty-wishlist-desc">
              Start shopping and discover great deals!
            </p>
            <button
              className="partha-empty-wishlist-btn"
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

export default Wishlist;
