import Listing from "../models/Listing.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Listing
export const createListing = async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      state,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (!listingPhotos) {
      return res.status(400).send("No File uploaded");
    }
    
    const listingPhotoPaths = await Promise.all(listingPhotos.map(async (file) => {
      const listingPhoto = await uploadOnCloudinary(file.path);
      return listingPhoto.url;
    }));


    console.log("listingPhotoPaths :: ", listingPhotoPaths);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      state,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    await newListing.save();
    res.status(200).json(newListing);
  } catch (err) {
    res.status(409).json({
      message: "Fail to create listing",
      error: err.message,
    });
    console.log(err);
  }
};

// Get Listing by category

export const getListingByCategory = async (req, res) => {
  const qCategory = req.query.category;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 8; // Default limit to 15 listings per page

  try {
    let query = qCategory ? { category: qCategory } : {};

    const total = await Listing.countDocuments(query);

    // Getting list using pagination
    const listings = await Listing.find(query)
      .populate("creator")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ results: listings, total: total }); 
  } catch (err) {
    res.status(409).json({
      message: "Fail to fetch listings",
      error: err.message,
    });
    console.log(err);
  }
};

// Get listing by search
export const getListingBySearch = async (req, res) => {
  const { search } = req.params;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 8; // Default limit to 15 listings per page

  try {
    let query =
      search === "all"
        ? {}
        : {
            $or: [
              { category: { $regex: search, $options: "i" } },
              { title: { $regex: search, $options: "i" } },
            ],
          };
    const total = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
      .populate("creator")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ results: listings, total: total }); 
    
  } catch (err) {
    res.status(409).json({
      message: "Failed to fetch listings",
      error: err.message,
    });
    console.log(err);
  }
};

// Get Listing details
export const getListingDetails = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate("creator");

    res.status(202).json(listing);
  } catch (err) {
    res
      .status(404)
      .json({ message: " Listing cannot be found", error: err.message });
  }
};
