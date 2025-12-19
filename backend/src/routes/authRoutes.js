import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userID) => {
    return jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// ====================== REGISTER ======================
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic frontend validation
        if (!username || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        if (!email.includes("@"))
            return res.status(400).json({ message: "Invalid email format" });

        if (password.length < 6)
            return res.status(400).json({ message: "Password must be 6+ characters" });

        if (username.length < 3)
            return res.status(400).json({ message: "Username must be at least 3 characters long" });

        // Check duplicates
        const emailExists = await User.findOne({ email });
        if (emailExists)
            return res.status(400).json({ message: "Email already in use" });

        const usernameExists = await User.findOne({ username });
        if (usernameExists)
            return res.status(400).json({ message: "Username already in use" });

        const profileImage =
            `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${username}`;

        const newUser = new User({
            username,
            email,
            password,
            profileImage
        });

        await newUser.save();

        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "Account created successfully!",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });

    } catch (error) {
        console.log("Register Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ====================== LOGIN ======================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });

        // Check if input is email or username
        const isEmail = email.includes("@");
        const user = isEmail
            ? await User.findOne({ email })
            : await User.findOne({ username: email });

        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;