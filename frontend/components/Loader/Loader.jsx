// src/components/Loader/Loader.jsx
import "./Loader.css"; // optional if you want styling
const Loader = ({ isVisible, message = "" }) => {
  if (!isVisible) return null;
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
