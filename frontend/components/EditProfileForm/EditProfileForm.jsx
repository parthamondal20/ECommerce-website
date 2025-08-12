import "./EditProfileForm.css";
import useUser from "../../context/UserContext/UserContext";
import { showSuccessToast, showErrorToast } from "../../utiles/Toast/toast.js";
import { changeUserDetails } from "../../services/user.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function EditProfileForm() {
  const { user, setUser } = useUser();
  const [mobileNo, setMobileNo] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const handleSave = async () => {
    try {
      const res = await changeUserDetails({
        userId: user._id,
        mobileNo,
        username,
      });
      console.log(res);
      console.log(user);
      setUser(res);
      showSuccessToast(`Saved Changes`);
      navigate(-1, { replace: true });
    } catch (error) {
      console.log(error);
      showErrorToast(`Something went wrong!`);
    }
  };
  return (
    <div className="edit-profile-section">
      <h2>Edit Profile</h2>
      <label>
        <span>Change Username</span>
        <input
          type="text"
          placeholder="Enter new username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        <span>Change Mobile Number</span>
        <input
          type="text"
          placeholder="Enter new mobile no"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
        />
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}
export default EditProfileForm;
