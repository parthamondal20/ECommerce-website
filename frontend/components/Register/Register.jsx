import { useState } from "react";
import "./Register.css";
import { showErrorToast, showSuccessToast } from "../../utiles/Toast/toast.js";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, sendOtp, verifyOtp } from "../../services/user.js";
import useUser from "../../context/UserContext/UserContext.jsx";
import { useGoogleAuthLogin } from "../../services/googleLogin.js";
import Loader from "../Loader/Loader.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import VerifyOtp from "../VerifyOtp/VerifyOtp.jsx";
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [usingGoogle, setUsingGoogle] = useState(false);
  const [showotpPage, setShowOtpPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!usingGoogle) {
      setLoading(true);
      try {
        await registerUser({ username, email, password });
        await sendOtp(email, username, password, "register");
        setShowOtpPage(true);
      } catch (error) {
        console.log(error);
        showErrorToast(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };
  const loginWithGoogle = useGoogleAuthLogin(
    (user) => {
      showSuccessToast(`Welcome ${user.username}!`);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/", { replace: true });
      setUser(user);
    },
    (err) => {
      showErrorToast(`Login failed! Please try again`);
    }
  );
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOtp(email, otp, "register");
      // console.log(res);
      // console.log(res.data.user);
      setShowOtpPage(false);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      showSuccessToast(`Welcome ${user.username}`);
      navigate("/", { replace: true });
    } catch (error) {
      showErrorToast("Something went Wrong! Please try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {!showotpPage ? (
        <>
          <Loader isVisible={loading} message="Sending OTP" />
          <form className="form" onSubmit={handleRegistration}>
            <h1
              style={{
                fontSize: "22px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Create Account
            </h1>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <p>
              Already have a Account?{" "}
              <Link className="loginPage" to="/login">
                login
              </Link>
            </p>
            <button type="submit" className="register-submit-btn">
              Request OTP
            </button>
            <h2 className="or">Or</h2>
            <button
              className="google-btn"
              onClick={() => {
                setUsingGoogle(true);
                loginWithGoogle();
              }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                style={{ width: "20px" }}
              />
              Continue with Google
            </button>
          </form>
        </>
      ) : (
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
      )}
    </>
  );
}
export default Register;
