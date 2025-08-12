import "./VerifyOtp.css";
import { verifyOtp } from "../../services/user";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { showErrorToast } from "../../utiles/Toast/toast";
function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state;

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(email, otp, "reset-password");
      navigate("/reset-password", { state: email, replace: true });
    } catch (error) {
      console.log(error);
      showErrorToast("Something went Wrong! Please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="otp-form" onSubmit={handleOtpVerification}>
      <h2 className="otp-title">OTP Verification</h2>
      <p className="otp-subtext">
        We've sent a 6-digit OTP to your email: <strong>{email}</strong>
      </p>

      <div className="form-group otp-input-wrapper">
        <input
          id="otp"
          type="text"
          name="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="otp-input"
          required
        />
      </div>

      <button disabled={loading} type="submit" className="verify-otp-btn">
        {loading ? "Verifying OTP..." : "Verify OTP"}
      </button>
    </form>
  );
}

export default VerifyOtp;
