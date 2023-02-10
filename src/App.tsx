import {Route, Routes } from "react-router-dom";
import "./App.css";
import Cart from "./components/Cart";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SignUpIn from "./components/SignUpIn";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signupin" element={<SignUpIn />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cart" element={<Cart />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
