import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/user";
import { showErrorToast, showSuccessToast } from "../../utiles/Toast/toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Using FaEye icons
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [match, setMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMatch(false);
      return;
    }
    try {
      await resetPassword(email, password);
      showSuccessToast("Password updated successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      showErrorToast("Something went wrong!");
    }
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    setMatch(password === e.target.value);
  };

  return (
    <form className="reset-form" onSubmit={handleSubmit}>
      <h2>Reset Password</h2>

      {/* New Password */}
      <div className="form-group">
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <div className="password-input-wrapper">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmChange}
            style={{
              borderColor: confirmPassword ? (match ? "green" : "red") : "#ddd",
            }}
            required
          />
          <span
            className="toggle-icon"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {!match && confirmPassword ? (
          <p className="error-text">Passwords do not match</p>
        ) : null}
        {match && confirmPassword ? (
          <p className="match-text">Passwords matched</p>
        ) : null}
      </div>

      <button type="submit">Reset Password</button>
    </form>
  );
}

export default ResetPassword;
