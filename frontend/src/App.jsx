import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import RequestOTP from "./pages/RequestOTP";
import VerifyOTP from "./pages/VerifyOTP";
import Success from "./pages/Success";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/request-otp" element={<RequestOTP />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
