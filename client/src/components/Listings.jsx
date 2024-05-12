import React, { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../config";
import { setListings } from "../redux/state";
import { Pagination, Stack } from "@mui/material";
import SkeletonLoader from "../components/SkeletonLoader";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const listings = useSelector((state) => state.listings);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(8);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1); // Reset page number to 1 when category changes
  };

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== "All"
          ? `${API_URL}/properties?category=${selectedCategory}&page=${page}&limit=${pageSize}`
          : `${API_URL}/properties?page=${page}&limit=${pageSize}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setListings({ listings: data.results }));
      setTotalPages(Math.ceil(data.total / pageSize));
      setLoading(false);
    } catch (err) {
      console.log("Failed to fetch listings :: ", err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    getFeedListings();
  }, [selectedCategory, page]);

  return (
    <>
      <div className="category-list">
        {categories.map((category, index) => (
          <div
            className={`category ${
              category.label === selectedCategory ? "selected" : ""
            }`}
            key={index}
            onClick={() => handleCategoryChange(category.label)}
          >
            <div className="category_icon">
              <category.icon />
            </div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{display:"flex",flexWrap:"wrap", justifyContent:"center", gap:"1.5rem", marginBottom:"3rem"}}><SkeletonLoader /></div>
      ) : (
        <>
          <div className="listings">
            {listings.map(
              (
                {
                  _id,
                  creator,
                  listingPhotoPaths,
                  title,
                  city,
                  state,
                  country,
                  category,
                  type,
                  price,
                  booking = false,
                },
                index
              ) => (
                <ListingCard
                  key={index}
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  title={title}
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
          <div className="pagination">
            <Stack spacing={2} sx={{ marginTop: "20px" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                sx={{'& .Mui-selected': {
                  backgroundColor: '#FFB5C6',
                }}}
              />
            </Stack>
          </div>
        </>
      )}
    </>
  );
};

export default Listings;
