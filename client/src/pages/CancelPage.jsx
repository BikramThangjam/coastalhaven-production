import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CancelPage = () => {
  return (
    <div style={{display:"flex", flexDirection:"column", minHeight:"100vh"}}>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
          padding: "3rem 2rem",
          flex: 1,
        }}
      >
        <h1>Payment Canceled</h1>
        <p>Your payment was canceled.</p>
        <Link to="/">Back to homepage</Link>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default CancelPage;
