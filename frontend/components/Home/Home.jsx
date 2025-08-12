import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { getAllProducts } from "../../services/product.js";
import { addProductToWishList, getWishlist } from "../../services/wishlist.js";
import Loader from "../Loader/Loader";
import useUser from "../../context/UserContext/UserContext.jsx";
import { showErrorToast, showSuccessToast } from "../../utiles/Toast/toast.js";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, setUser } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const sortOption = searchParams.get("sort") || "";
  const location = useLocation();

  const fetchProducts = async (category, sortOption, query) => {
    try {
      setLoading(true);
      const [res, wishlistRes] = await Promise.all([
        getAllProducts(category, sortOption, query),
        user ? getWishlist(user._id) : Promise.resolve([]),
      ]);

      if (user) {
        setWishlist(wishlistRes.map((item) => item._id));
      }
      setProducts(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cat = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";
    const query = searchParams.get("query") || "";
    setCategory(cat);
    fetchProducts(cat, sort, query);
  }, [searchParams]); // removed user & wishlistLoading to prevent over-fetching

  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setCategory(cat);
  }, [location]);

  const handleCatagoryClick = (category) => {
    setSearchParams({ category: category, sort: "" });
    setCategory(category);
  };

  const addToWishList = async (productId) => {
    if (!user) {
      showErrorToast("Please login to add the product in wishlist");
      navigate("/login");
      return;
    }
    try {
      const userId = user._id;
      const res = await addProductToWishList({ productId, userId });

      // Update wishlist locally without re-fetch
      setWishlist((prev) => [...prev, productId]);

      // Update the specific product's wishlisted status
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? { ...p, wishlisted: true } : p
        )
      );

      setUser(res);
      showSuccessToast("product added to wishlist");
    } catch (error) {
      showErrorToast("Failed to add the product in wishlist");
      console.log(error);
    }
  };

  const sortOptions = [
    { label: "Featured", value: "Featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Rating: High to Low", value: "rating-desc" },
    { label: "Newest", value: "Newest" },
  ];

  const catagories = [
    "Mobiles",
    "Computers",
    "Electronics",
    "Groceries",
    "Watches",
    "Shoes",
    "Beauty",
  ];

  return (
    <>
      <Loader isVisible={loading} />
      <div className="categories">
        {catagories.map((cat, index) => (
          <p
            onClick={() => handleCatagoryClick(cat)}
            className={`category ${category === cat ? "active disabled" : ""}`}
            key={index}
            disabled={category === cat}
          >
            {cat}
          </p>
        ))}
      </div>

      {category && (
        <div className="sort-container">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortOption}
            onChange={(e) => {
              const value = e.target.value;
              setSearchParams({ category: category, sort: value });
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="product-grid">
        {products.length > 0
          ? products.map((product) => (
              <div
                className="product-card"
                key={product._id}
                onClick={() => {
                  navigate(`product/${product._id}`);
                }}
              >
                <div className="product-details">
                  <img
                    loading="lazy" // ✅ Lazy loading images for faster page load
                    src={product.image}
                    alt={product.name}
                  />
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                  <p>{product.rating} ★</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishList(product._id);
                  }}
                  className={`wishlist-icon ${
                    wishlist.includes(product._id) && user ? "deactive" : ""
                  }`}
                  disabled={wishlist.includes(product._id)}
                >
                  {!wishlist.includes(product._id) || !user
                    ? "add to wishlist"
                    : "wishlisted"}
                </button>
              </div>
            ))
          : !loading && (
              <div className="no-product-wrapper">
                <div className="no-product-result-msg">
                  <img
                    src="https://img.freepik.com/premium-vector/no-result-found-empty-results-popup-design_586724-96.jpg"
                    alt="no-product-result"
                    className="no-product-result-img"
                  />
                  <p className="no-product-result-text">No results found</p>
                </div>
              </div>
            )}
      </div>
    </>
  );
}

export default Home;
