import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../config";
import { setListings } from "../redux/state";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import SkeletonLoader from "../components/SkeletonLoader";
import { Pagination, Stack } from "@mui/material";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const getSearchListings = async () => {
    try {
      const response = await fetch(
        `${API_URL}/properties/search/${search}?page=${page}&limit=${pageSize}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setListings({ listings: data.results }));
      setTotalPages(Math.ceil(data.total / pageSize));
      setLoading(false);
    } catch (err) {
      console.log("Failed to fetch search list".err, message);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search, page]);

  return (
    <div className="list-container">
      <Navbar />
      <h1 className="title-list">{search} results</h1>
      <div className="list">
        {loading ? (
          <SkeletonLoader />
        ) : listings?.length < 1 ? (
          <h3>No results found...</h3>
        ) : (
          listings.map(
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
        )}
      </div>
      <div className="pagination">
        <Stack spacing={2} sx={{ marginTop: "20px" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            sx={{
              "& .Mui-selected": {
                backgroundColor: "#FFB5C6",
              },
            }}
          />
        </Stack>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default SearchPage;
