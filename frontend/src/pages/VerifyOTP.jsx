import { useNavigate } from "react-router-dom";
import { useState } from "react";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verify = () => {
    navigate("/success");
  };

  return (
    <>
      <h2>Verify OTP</h2>
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <br />
      <button onClick={verify}>Verify & Open Locker</button>
    </>
  );
}

export default VerifyOTP;
