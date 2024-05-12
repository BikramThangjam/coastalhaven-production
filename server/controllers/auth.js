import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Register user
export const register = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;

        // uploaded file available on req.file
        let profileImage = req.file

        if(!profileImage){
            return res.status(400).send("No file uploaded")
        }

        // path to the uploaded profile image
        const profileImagePath = profileImage.path;

        profileImage = await uploadOnCloudinary(profileImagePath);
        
        // check if user exist
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({message: "User already exists!"})
        }

        // hash the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)

        // create a new user
        const newUser = new User({
            firstName, 
            lastName, 
            email, 
            password: hashedPassword,
            profileImagePath: profileImage?.url || "",
        })

        // save the new user in db
        await newUser.save()

        res.status(200).json({message: "User registered successfully", user: newUser})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Registration failed", error: err.message})
    }
}

// Login user

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
         // check if user exist
         const user = await User.findOne({email})
         if(!user){
             return res.status(409).json({message: "User does not exist!"})
         }
         // compare the password with hashed password
         const isMatch = await bcrypt.compare(password, user.password)
         if(!isMatch){
            return res.status(400).json({message: "Invalid credentials!"})
         }

         // Generate jwt token
         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
         delete user.password

        res.status(200).json({token, user})

    } catch (err) {
        console.log(err)
        return res.status(500).json({error: err.message});
    }
}