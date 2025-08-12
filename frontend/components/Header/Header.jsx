import { Link } from "react-router-dom";
import "./header.css";
import useUser from "../../context/UserContext/UserContext.jsx";
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // add this if not already
import { showErrorToast, showSuccessToast } from "../../utiles/Toast/toast.js";
import { logoutUser } from "../../services/user.js";
import { useLocation, useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";
import fuse from "../../utiles/fuseLogic.js";
function Header() {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const menuRef = useRef(null);
  const suggestionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (input) => {
    if (input.trim() === "") return setSuggestions([]);
    try {
      // const res = await getProductSuggestions(input);
      const results = fuse.search(input).slice(0, 7);
      // setSuggestions(res.data);
      setSuggestions(results.map((result) => result.item));
      setShowSuggestions(true);
    } catch (error) {
      console.log(error);
    }
  };

  const debounceFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  useEffect(() => {}, [user]);
  async function handleLogOut() {
    try {
      const res = await logoutUser(user._id);
      setUser(null);
      setMenuOpen(false);
      localStorage.removeItem("user");
      showSuccessToast(res.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      showErrorToast("something went wrong");
    }
  }

  useEffect(() => {
    const query = searchParams.get("query");
    if (!query) {
      setSearchQuery("");
    } else {
      setSearchQuery(query);
    }
  }, [location]);

  useEffect(() => {
    return () => {
      debounceFetchSuggestions.cancel(); // cancel pending call on unmount
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setSearchParams({ query: searchQuery.trim() });
      setShowSuggestions(false);
    }
  };

  return (
    <header className="header">
      <h1 className="logo" onClick={() => navigate("/")}>
        My Shop
      </h1>
      <div className="search-wrapper" ref={suggestionRef}>
        <input
          type="text"
          placeholder="Search for any product"
          className="search-box"
          value={searchQuery}
          onFocus={() => searchQuery && setShowSuggestions(true)}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            debounceFetchSuggestions(value);
          }}
          onKeyDown={handleSearch}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  setShowSuggestions(false);
                  setSearchQuery(item.name);
                  setSearchParams({ query: item.name.trim() });
                }}
                className="suggestion-item"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <nav className="nav-links">
        {user ? (
          <>
            <div className="menu-wrapper" ref={menuRef}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                title="Account"
                ref={menuRef}
              >
                <img
                  src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg"
                  alt="account"
                />
              </div>
              <div className={`dropdown-menu ${menuOpen ? "open" : ""}`}>
                <Link to="/myAccount" onClick={() => setMenuOpen(false)}>
                  <img
                    className="dropdown-image"
                    src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg"
                    alt="My profile"
                  />
                  My Profile
                </Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)}>
                  <img
                    className="dropdown-image"
                    src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/orders-bfe8c4.svg"
                    alt=""
                  />
                  Orders
                </Link>
                <Link to="/Wishlist" onClick={() => setMenuOpen(false)}>
                  <img
                    className="dropdown-image"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIwLjI0OUMxMiAyMC4yNDkgMi42MjUgMTQuOTk5IDIuNjI1IDguNjI0MDNDMi42MjUgNy40OTcwNSAzLjAxNTQ2IDYuNDA0ODggMy43Mjk5NiA1LjUzMzM0QzQuNDQ0NDUgNC42NjE3OSA1LjQzODg0IDQuMDY0NzIgNi41NDM5MyAzLjg0MzdDNy42NDkwMyAzLjYyMjY4IDguNzk2NTcgMy43OTEzNyA5Ljc5MTMxIDQuMzIxMDZDMTAuNzg2MSA0Ljg1MDc2IDExLjU2NjUgNS43MDg3NCAxMiA2Ljc0OTAzVjYuNzQ5MDNDMTIuNDMzNSA1LjcwODc0IDEzLjIxMzkgNC44NTA3NiAxNC4yMDg3IDQuMzIxMDZDMTUuMjAzNCAzLjc5MTM3IDE2LjM1MSAzLjYyMjY4IDE3LjQ1NjEgMy44NDM3QzE4LjU2MTIgNC4wNjQ3MiAxOS41NTU1IDQuNjYxNzkgMjAuMjcgNS41MzMzNEMyMC45ODQ1IDYuNDA0ODggMjEuMzc1IDcuNDk3MDUgMjEuMzc1IDguNjI0MDNDMjEuMzc1IDE0Ljk5OSAxMiAyMC4yNDkgMTIgMjAuMjQ5WiIgc3Ryb2tlPSIjMjEyMTIxIiBzdHJva2Utd2lkdGg9IjEuNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
                    alt=""
                  />
                  Wishlist
                </Link>
                <button onClick={() => handleLogOut()}>
                  <img
                    className="dropdown-image"
                    src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/logout-e63ddf.svg"
                    alt=""
                  />
                  Logout
                </button>
              </div>
            </div>
            <Link to="/myCart" title="My cart">
              <img
                src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header_cart-eed150.svg"
                alt=""
              />
            </Link>
          </>
        ) : (
          <>
            <Link to="/register">Create Account</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
export default Header;
