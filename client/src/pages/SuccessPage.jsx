import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const SuccessPage = () => {
  const userId = useSelector(state => state.user._id)
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage after 3 seconds
    const timeout = setTimeout(() => {
      navigate(`/${userId}/trips`);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [history]);

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
        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          <h1>Payment Successful</h1>
          <CheckCircleOutlinedIcon sx={{fontSize: "2.3rem", color:"green"}}/>
        </div>
        <p>Your payment was successful. Thank you!</p>
        <p>Redirecting, please wait...</p>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default SuccessPage;
