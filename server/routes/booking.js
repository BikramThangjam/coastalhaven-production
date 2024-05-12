import express from "express";
import { stripeCheckout, deleteBooking } from "../controllers/booking.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

// router.post("/create", createBooking); replaced by /webhooks/stripe route

router.post("/create-checkout-session", verifyToken, stripeCheckout)
router.delete("/:bookingId",verifyToken, deleteBooking);

export default router;
