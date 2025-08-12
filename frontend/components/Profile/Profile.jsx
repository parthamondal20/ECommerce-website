import { Link, useNavigate } from "react-router-dom";
import useUser from "../../context/UserContext/UserContext.jsx";
import { logoutUser, uploadAvatar } from "../../services/user.js";
import { showErrorToast, showSuccessToast } from "../../utiles/Toast/toast.js";
import "./Profile.css";
import { useRef } from "react";
import { useState } from "react";
import Loader from "../Loader/Loader.jsx";
function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const fileInputRef = useRef(null);
  const [avatarLink, setAvatarLink] = useState(user.avatar);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  async function handleLogOut() {
    setLoading(true);
    try {
      const res = await logoutUser(user._id);
      setUser(null);
      localStorage.removeItem("user");
      showSuccessToast(res.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      showErrorToast("something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // to handle the avatar change
  const handleClick = async () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("userId", user._id);
    setLoading(true);
    try {
      const res = await uploadAvatar(formdata);
      setUser(res);
      setAvatarLink(res.avatar);
      localStorage.setItem("user", JSON.stringify(res));
      showSuccessToast("Avatar uploaded!");
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to upload the Avatar image");
    } finally {
      setLoading(false);
    }
  };

  /* logic to implement the full avatar pick load on click */

  const handleAvatarClick = () => {
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
  };

  /*Rest of the react component */

  return (
    <div className="profile-container">
      <Loader isVisible={loading} message="Uploading photo" />
      <button
        className="edit-profile-btn"
        onClick={() => navigate("/Edit-Profile")}
      >
        Edit Profile
      </button>
      {/*Just the profile avatar*/}
      <img
        src={avatarLink}
        alt="no image"
        className="avatar-image"
        onClick={handleAvatarClick}
      />
      {/* For the full preview of the profile picture */}
      {previewVisible && (
        <div className="avatar-preview-overlay" onClick={closePreview}>
          <img
            src={avatarLink}
            alt="Full Preview"
            className="avatar-preview-image"
          />
        </div>
      )}

      {/*The avatar change button */}

      <button className="change-avatar-btn" onClick={handleClick}>
        Change Avatar
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <div className="profile-info">
        <p>{user?.username}</p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>{user?.mobileNo}</p>
      </div>
      <div className="profile-actions">
        <Link to="/orders" className="profile-link">
          📦 View Orders
        </Link>
        <Link to="/Wishlist" className="profile-link">
          Wishlist
        </Link>
        <button className="logout-btn" onClick={handleLogOut}>
          🚪 Log out
        </button>
      </div>
    </div>
  );
}
export default Profile;
