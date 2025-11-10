import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
    //res.send("register");
    try {
        const { username, email, password } = req.body;
        
        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if(username.length < 6) {
            return res.status(400).json({ message: "Username must be at least 6 characters long" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const existingUsername = await User.findOne({ email });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already in use" });
        }

        const profileImage = 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${username}';

        const user = new User({ 
            username,
            email,
            password,
            profileImage, 
        });

        await user.save();

    } catch (error) {

    }
});

router.get("/login", async (req, res) => {
    res.send("Login Successfully");
});



export default router;