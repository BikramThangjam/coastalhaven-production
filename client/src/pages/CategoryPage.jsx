import React, { useState, useEffect } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import ListingCard from "../components/ListingCard";
import { API_URL } from "../config";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const {category} = useParams();
  const listings = useSelector(state => state.listings)
  const dispatch = useDispatch();

  const getFeedListings = async () => {
    try {
      const response = await fetch(`${API_URL}/properties?category=${category}`,
        {
          method: "GET",
        });

      const data = await response.json();
      dispatch(setListings({ listings: data.results }));
      setLoading(false);
    } catch (err) {
      console.log("Failed to fetch listings :: ", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      <div className="list">
        {listings?.map(
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
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
