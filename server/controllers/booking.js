import dotenv from "dotenv";
dotenv.config();
import Booking from "../models/Booking.js";
import Stripe from "stripe";
import { client_url } from "../url/clienturl.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Creating Stripe checkout session
export const stripeCheckout = async (req, res) => {
  try {
    const { name, imageUrl, customerId, listingId, hostId, startDate, endDate, totalPrice } = req.body;

    const session = await stripe.checkout.sessions.create({
      success_url:`${client_url}/success`,
      cancel_url:`${client_url}/cancel`,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: name,
              images:[imageUrl],
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      
      mode: "payment",
      metadata: {
        customerId,
        listingId,
        hostId,
        startDate,
        endDate,
        totalPrice,
      },
    }); 

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// Handle stripe webhook events
export const stripeWebhooks = async (req, res) => {
  console.log("stripeWebhooks is executing...")
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Error verifying Stripe webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("event type :: ", event.type);

  if (event.type === "checkout.session.completed") {
    console.log("inside the checkout.session.completed block");
    const session = event.data.object;

    // Check if metadata exists before accessing it
    if (session.metadata) {
      const { customerId, listingId, hostId, startDate, endDate, totalPrice } = session.metadata;

      try {
        console.log("creating new booking in mongodb...")
        const newBooking = await Booking.create({
          customerId,
          listingId,
          hostId,
          startDate,
          endDate,
          totalPrice,
        });

        res.status(200).json({ message: "Booking confirmed" });
      } catch (err) {
        console.error("Error creating booking:", err.message);
        res.status(500).json({ error: "Failed to create booking" });
      }
    } else {
      console.error("Metadata is missing in checkout session:", session);
      res.status(400).json({ error: "Metadata is missing in payment intent" });
    }
  }
};

// Create booking
// export const createBooking = async (req, res) => {
//   try {
//     const { customerId, hostId, listingId, startDate, endDate, totalPrice } =
//       req.body;
//     const newBooking = new Booking({
//       customerId,
//       hostId,
//       listingId,
//       startDate,
//       endDate,
//       totalPrice,
//     });

//     await newBooking.save();
//     res.status(200).json(newBooking);
//   } catch (err) {
//     console.log(err);
//     res
//       .status(400)
//       .json({ message: "Failed to create a new booking", error: err.message });
//   }
// };

// Delete booking
export const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking has been cancelled" });
  } catch (err) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
