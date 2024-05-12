import React from "react";
import "../styles/List.scss";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);
  return (
    <div className="list-container">
      <Navbar />
      <h1 className="title-list">Your Wishlist</h1>
      <div className="list">
        {
          wishList?.length < 1 ? (
            <h3>Your wishlist are empty!</h3>
          ) :(
            wishList.map(
              ({
                _id,
                creator,
                listingPhotoPaths,
                city,
                state,
                country,
                category,
                type,
                price,
                booking = false,
              }) => (
                <ListingCard
                  key={_id}
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  city={city}
                  state={state}
                  country={country}
                  category={category}
                  type={type}
                  price={price}
                  booking={booking}
    
                />
              )
            )
          )
        }
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default WishList;
