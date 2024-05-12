import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";
import { facilities } from "../data";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import "../styles/ListingDetails.scss";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";

import { loadStripe } from "@stripe/stripe-js";

const ListingDetails = () => {
  const token = useSelector(state => state.token);
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [isDateRangeSelected, setIsDateRangeSelected] = useState(false);

  const getListingDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/properties/${listingId}`, {
        method: "GET",
      });

      const data = await response.json();
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Failed to fetch listing details", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  // Booking calender
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // update selected date range when user makes a selection
    setDateRange([ranges.selection]);
    setIsDateRangeSelected(true);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // (end-start) gives the results in milliseconds, calculating in days

  // Submit booking
  const customerId = useSelector((state) => state?.user?._id);
  const navigate = useNavigate();

  const handlePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51N8crmSHXPb5tMRo0q5TwITYN2zoB7fgCQ1xgsRUoAU3L6aob8ztumrNf3J8EalEqKHpVzsEnmUpJv3ng4G6JFKC00UAWdimEc"
    );

    if (!isDateRangeSelected) {
      // If date range is not selected, return early
      alert("Please select dates.");
      return;
    }

    if(!token){
      navigate("/login")
    }

    try {
      const bookingForm = {
        name: listing.title,
        imageUrl: listing.listingPhotoPaths[0],
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      // Creates a checkout session on server
      const response = await fetch(
        `${API_URL}/bookings/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`,
          },
          body: JSON.stringify(bookingForm),
        }
      );

      const data = await response.json();

      // Redirect to Stripe checkout page
      const result = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      console.log("stripe result :: ", result)

      if (result.error) {
        console.log(result.error.message);
      }
      
    } catch (err) {
      console.log("Booking failed ", err.message);
    }
  };

  // full image view
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openFullImage = (src) => {
    setSelectedImage(src);
    setFullImageOpen(true);
  };

  const closeFullImage = () => {
    setFullImageOpen(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>
        <div className="photos">
          {listing.listingPhotoPaths?.map((photo, index) => (
            <div key={index}>
              <img
                src={photo}
                alt="Listing photos"
                className="thumbnail"
                onClick={() =>
                  openFullImage(photo)
                }
              />

              {fullImageOpen && (
                <div className="full-image-view">
                  <span className="close-button" onClick={closeFullImage}>
                    &times;
                  </span>
                  <img
                    src={selectedImage}
                    alt="Listing photos"
                    className="full-image"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <h2>
          {listing.type} in {listing.city}, {listing.state}, {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={listing.creator.profileImagePath}
            alt="profileImage"
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {React.createElement(
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    )}
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calender">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  &#8377;{listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  &#8377;{listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total Price: &#8377; {listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>
              <button className="btn" onClick={handlePayment}>
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetails;
