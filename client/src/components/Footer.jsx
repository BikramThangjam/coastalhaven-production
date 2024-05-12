import React from 'react';
import "../styles/Footer.scss";
import {LocationOn, LocalPhone, Email} from "@mui/icons-material"

const Footer = () => {
  return (
    <div className='footer' style={{ boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', paddingTop: '20px', backgroundColor: '#f4f4f4' }}>
      <div className="footer_left">
        <a href="/" className='socials'><img src="https://res.cloudinary.com/doqjl4k7t/image/upload/v1714806453/coastalhaven/logo.png" alt="logo" /></a>
      </div>
      <div className="footer_center">
        <h3>Useful Links</h3>
        <ul>
          <li>About Us</li>
          <li>Terms and Conditions</li>
          <li>Return and Refund policy</li>
        </ul>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        <div className="footer_right_info">
          <LocationOn sx={{ fontSize: { xs: '15px', sm: '20px' } }} />
          <p>Bangalore, India</p>
        </div>
        <div className="footer_right_info">
          <LocalPhone sx={{ fontSize: { xs: '15px', sm: '20px' } }}/>
          <p>+91 9875674324</p>
        </div>
        <div className="footer_right_info">
          <Email sx={{ fontSize: { xs: '15px', sm: '20px' } }}/>
          <p>coastalhaven@support.com</p>
        </div>
        <img src="https://res.cloudinary.com/doqjl4k7t/image/upload/v1714806479/coastalhaven/payment.png" alt="payment" />
      </div>
    </div>
  )
}

export default Footer;
