import { useState, useEffect } from "react";
import "../styles/Auth.css";

export default function Signup({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // Store OTP from backend
  const [generatedPassword, setGeneratedPassword] = useState(""); // Store password from backend

  // Countdown timer
  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  // ------------------------------
  // 1️⃣ SEND OTP – API CALL
  // ------------------------------
  async function handleGetOtp() {
    if (!email) {
      setMessage("Please enter an email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setTimer(30);
        setGeneratedOtp(data.otp);
        setGeneratedPassword(data.password);
        setMessage("✅ Account created! Check details below.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error while creating account.");
    }

    setLoading(false);
  }

  // ------------------------------
  // OTP Input Handler
  // ------------------------------
  function handleChangeOtp(value, index) {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  // ------------------------------
  // 2️⃣ VERIFY OTP – API CALL
  // ------------------------------
  async function handleSignup() {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      setMessage("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: finalOtp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Signup successful! Redirecting to login...");
        setTimeout(() => goToLogin(), 1500);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error during OTP verification.");
    }

    setLoading(false);
  }

  return (
    <div className="auth-box">
      <h2>Sign Up</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {!otpSent && (
        <button onClick={handleGetOtp} disabled={loading}>
          {loading ? "Creating account..." : "Get OTP"}
        </button>
      )}

      {otpSent && (
        <>
          {/* TESTING MODE: Show OTP and Password */}
          <div style={{
            backgroundColor: "#e8f5e9",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
            marginBottom: "10px"
          }}>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>🔑 Your OTP:</strong> <span style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "16px" }}>{generatedOtp}</span>
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>🔐 Your Password:</strong> <span style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "16px" }}>{generatedPassword}</span>
            </p>
          </div>

          <label style={{ marginTop: "10px" }}>Enter OTP</label>

          <div className="otp-row">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                className="otp-box"
                value={digit}
                onChange={(e) => handleChangeOtp(e.target.value, index)}
              />
            ))}
          </div>

          <p className="timer-text">
            {timer > 0 ? (
              <>Resend OTP in {timer}s</>
            ) : (
              <button className="resend-btn" onClick={handleGetOtp}>
                Resend OTP
              </button>
            )}
          </p>

          <button onClick={handleSignup} disabled={loading}>
            {loading ? "Verifying..." : "Sign Up"}
          </button>
        </>
      )}

      {message && <p className="msg-text">{message}</p>}
    </div>
  );
}