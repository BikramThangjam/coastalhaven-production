import express from "express";
import { getTripList, addToWishlist, getPropertyList, getReservationList } from "../controllers/user.js";

const router = express.Router();

// Get trip list
router.get("/:userId/trips", getTripList)

// Add Listing to wishlist
router.patch("/:userId/:listingId", addToWishlist )

// Get property list
router.get("/:userId/properties", getPropertyList)

// Get reservation list
router.get("/:userId/reservations", getReservationList )


export default router;