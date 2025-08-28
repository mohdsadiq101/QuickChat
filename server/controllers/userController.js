import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


// Signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "All fields are required" });
        }
        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
    const newUser = new User({ fullName, email, password: hashedPassword, bio });
    await newUser.save();

        const token = generateToken(newUser._id);

    res.json({ success: true, user: newUser, token, message: "Account created successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Internal server error" });
    }
}

// Controller to login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);
        res.json({ success: true, user: userData, token, message: "Login successful" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Internal server error" });
    }
}


// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
        return res.json({ success: true, user: req.user });
};


// Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body || {};
        const userId = req.user._id;

        let updateData = {};

        if (bio !== undefined) updateData.bio = bio;
        if (fullName !== undefined) updateData.fullName = fullName;

        if (profilePic !== undefined && profilePic !== "") {
            const uploadResponse = await cloudinary.uploader.upload(profilePic, {
                folder: "chat_app_profiles",
                resource_type: "image"
            });
            updateData.profilePic = uploadResponse.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update profile error:", error.message);
        res.json({ success: false, message: "Internal server error" });
    }
};
