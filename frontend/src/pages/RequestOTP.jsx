import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RequestOTP() {
  const [contact, setContact] = useState("");
  const navigate = useNavigate();

  const sendOtp = () => {
    navigate("/verify-otp");
  };

  return (
    <>
      <h2>Request OTP</h2>
      <input
        placeholder="Enter phone or email"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <br />
      <button onClick={sendOtp}>Send OTP</button>
    </>
  );
}

export default RequestOTP;
