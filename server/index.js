import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listing.js";
import bookingRoutes from "./routes/booking.js";
import userRoutes from "./routes/user.js";
import { stripeWebhooks } from "./controllers/booking.js";
import path from "path";

// CONFIGURATIONS
const __dirname = path.resolve();

const app = express();
app.use(cors());

//Webhook payload must be provided as a string or a Buffer instance representing the _raw_ request body.
//Hence placing it before the app.use(express.json()) to avoid being parsed to js object
app.post("/webhook",express.raw({type: 'application/json'}), stripeWebhooks)

app.use(express.json())


// Routes
app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));
//react app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
  

// Mongoose setup
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URL, {
    dbName: "coastalhaven",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> {
    app.listen(PORT, ()=> console.log(`Server is listening on ${PORT}`))
})
.catch(err => console.log(`${err} did not connect`))