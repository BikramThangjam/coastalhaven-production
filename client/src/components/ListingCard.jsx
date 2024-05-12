import React, { useState } from "react";
import "../styles/ListingCard.scss";
import { API_URL } from "../config";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWishList, setReservationList,setTripList } from "../redux/state";

const ListingCard = ({
  id,
  listingId,
  creator,
  listingPhotoPaths,
  title,
  city,
  state,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
  isReserved,
  customer,
  createdAt
}) => {

  const token = useSelector(state => state.token);
  // Slider for images
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };
  const goToNextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };
  const navigate = useNavigate();

  // Add to Wishlist
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  const dispatch = useDispatch();

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    if (user?._id !== (!booking ? creator._id : creator)) {
      const response = await fetch(
        `${API_URL}/users/${user._id}/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      dispatch(setWishList(data.wishList));
    } else {
      return;
    }
  };

  // Cancel/ delete booking
  const tripList = useSelector(state => state?.user?.tripList)
  const reservationList = useSelector(state => state?.user?.reservationList)

  const handleCancelBooking = async (e) => {
    e.stopPropagation();
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization" : `Bearer ${token}`,
      },
    })
    
    if(isReserved){
      const updatedList = reservationList.filter(booking => booking._id !== id)
      dispatch(setReservationList(updatedList));
    }else{
      const updatedList = tripList.filter(booking => booking._id !== id)
      dispatch(setTripList(updatedList));
    }
  }

  return (
    <div
      className="listing-card"
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      {
        isReserved && (
          <div className="bookingInfo" >
            <p>Booked by: {customer.firstName} {customer.lastName}</p>
            <p>Booked On: {new Date(createdAt).toLocaleDateString ()} </p>
          </div>
        )
      }
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div className="slide" key={index}>
              <img
                src={photo}
                alt={`photo ${index + 1}`}
                style={{ objectFit: "fill" }}
              />
            </div>
          ))}
        </div>
        <div className="prev-button" onClick={goToPrevSlide}>
          <ArrowBackIosNew sx={{ fontSize: "15px" }} />
        </div>
        <div className="next-button" onClick={goToNextSlide}>
          <ArrowForwardIos sx={{ fontSize: "15px" }} />
        </div>
      </div>
      <h3>{title?.length > 25 ? title.slice(0, 25) + "..." : title}</h3>
      <h4>
        {city}, {state}, {country}
      </h4>
      <p>{category}</p>
      {!booking ? (
        <>
          <p style={{ marginBottom: "0.5rem" }}>{type}</p>
          <p>
            <span>&#8377;{price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>
          <div style={{display:"flex", justifyContent: "space-between", marginTop: "1.05rem"}}>
            <p><span>&#8377;{totalPrice}</span> total</p>
            <button 
              className="cancel-btn" 
              onClick={handleCancelBooking}
            >Cancel Booking</button>
          </div>
        </>
      )}

      {user?._id !== (!booking ? creator.id : creator) && (
        <button
          className="favorite"
          onClick={(e) => {
            e.stopPropagation();
            patchWishList();
          }}
          disabled={!user}
        >
          {isLiked ? (
            <Favorite sx={{ color: "red" }} />
          ) : (
            <Favorite sx={{ color: "white" }} />
          )}
        </button>
      )}
    </div>
  );
};

export default ListingCard;
