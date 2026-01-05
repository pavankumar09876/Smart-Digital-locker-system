import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/add-item">Add Item</Link> |{" "}
      <Link to="/request-otp">Request OTP</Link>
    </nav>
  );
}

export default Navbar;
