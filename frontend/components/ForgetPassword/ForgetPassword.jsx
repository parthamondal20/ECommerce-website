import { useState } from "react";
import "./ForgetPassword.css";
import Loader from "../Loader/Loader";
import { sendOtp } from "../../services/user.js";
import { showErrorToast } from "../../utiles/Toast/toast";
import { useNavigate } from "react-router-dom";
function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp(email, null, null, "reset-password");
      navigate("/Verify-OTP", { state: email });
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong! Please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="forget-password-container">
      <Loader isVisible={loading} />
      <form className="forget-password-form" onSubmit={handleSubmit}>
        <h2>Forgot Password?</h2>
        <p>
          Enter your email and we'll send you an OTP to reset your password.
        </p>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Send OTP
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;
