import express from "express";
import multer from "multer";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

// multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./server/public/temp/"); // Store uploaded files in the uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//  USER register
router.post("/register", upload.single("profileImage"), register);

// USER Login
router.post("/login", login);

export default router;