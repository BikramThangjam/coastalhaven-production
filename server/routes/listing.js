import express from "express";
import multer from "multer";
import { createListing, getListingByCategory, getListingBySearch, getListingDetails } from "../controllers/listing.js";

const router = express.Router();

// Multer configuration for file uploads

const storage = multer.diskStorage({
    destination: function(req, file,  cb){
        cb(null, "./server/public/temp")
    },
     filename: function (req, file, cb){
        cb(null, file.originalname); // orifinal filename
     }
})

const upload = multer({storage})

// Create listing
router.post("/create", upload.array("listingPhotos"), createListing)

// Get listing by category
router.get("/", getListingByCategory);

// Get listing by search
router.get("/search/:search", getListingBySearch)

// Listing details
router.get("/:listingId", getListingDetails)

export default router;