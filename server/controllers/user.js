import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js";


// Get trip list
export const getTripList = async (req, res) => {
    try {
        const {userId} = req.params;
        const trips = await Booking.find({customerId: userId}).populate("customerId hostId listingId");
        res.status(202).json(trips);

    } catch (err) {
       console.log(err)
       res.status(404).json({message: "Cannot find the trips!", error: err.message}) 
    }
}

// Add listing to wishlist

export const addToWishlist = async (req, res) => {
    try {
        const {userId, listingId} = req.params;
        const user = await User.findById(userId);
        const listing = await Listing.findById(listingId).populate("creator");

        const favoriteListing = user.wishList.find( item => item._id.toString() === listingId )
        if(favoriteListing){
            user.wishList = user.wishList.filter(item => item._id.toString() !== listingId)
            await user.save()
            res.status(200).json({message: "Listing is removed from wishlist", wishList: user.wishList})
        }else{
            user.wishList.push(listing)
            await user.save()
            res.status(200).json({message: "Listing is added to wishlist", wishList: user.wishList})
        }
    } catch (err) {
        console.log(err)
        res.status(404).json({error: err.message});                                                                     
    }
}

// Get property list

export const getPropertyList = async (req, res) => {
    try {
        const {userId} = req.params;
        const properties = await Listing.find({creator: userId}).populate("creator");
        res.status(202).json(properties);

    } catch (err) {
       console.log(err)
       res.status(404).json({message: "Cannot find the properties!", error: err.message}) 
    }
}

// Get reservation list

export const getReservationList = async (req, res) => {
    try {
        const {userId} = req.params;
        const reservations = await Booking.find({hostId: userId}).populate("customerId hostId listingId");
        res.status(202).json(reservations);

    } catch (err) {
       console.log(err)
       res.status(404).json({message: "Cannot find the reservations!", error: err.message}) 
    }
}