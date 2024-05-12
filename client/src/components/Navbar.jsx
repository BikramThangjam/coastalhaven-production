import "../styles/Navbar.scss";
import * as variables from "../styles/variables.scss";

import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setLogout } from "../redux/state";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <div className="navbar" style={{boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
      <a href="/">
        <img src="https://res.cloudinary.com/doqjl4k7t/image/upload/v1714806453/coastalhaven/logo.png" alt="logo" />
      </a>
      <div className="navbar_search">
        <input 
          type="text" 
          placeholder="search..." 
          name="search" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          
        />
        <IconButton disabled={search === ""}  onClick={() =>{ navigate(`/properties/search/${search}`)}}>
          <Search 
            sx={{ color: "#F8395A" }}
            />
        </IconButton>
      </div>
      <div className="navbar_right ">
        {user ? (
          <a className="host" href="/create-listing">
            Publish property
          </a>
        ) : (
          <a className="host" href="/login">
            Publish property
          </a>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropDownMenu(!dropDownMenu)}
        >
          <Menu sx={{ color: "#F8395A" }} />
          {!user ? (
            <Person sx={{ color: "#F8395A" }} />
          ) : (
            <img
              src={user.profileImagePath}
              alt="profile photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropDownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Login</Link>
            <Link to="/register">Singup</Link>
          </div>
        )}

        {dropDownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/trips`}>Trip List</Link>
            <Link to={`/${user._id}/wishList`}>Wishlist</Link>
            <Link to={`/${user._id}/properties`}>Property List</Link>
            <Link to={`/${user._id}/reservations`}>Reservation List</Link>
            <Link to="/create-listing">Publish Property</Link>
            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
