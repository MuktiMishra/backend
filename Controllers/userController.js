import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';

// Get User Profile Controller
const getUserProfile = async (req, res) => {
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password").select("-updatedAt");

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in getUserProfile:", error.message);
    }
};


// Signup User Controller
const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, username, password: hashedPassword });
        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.log("Error in signupUser:", error.message);
        res.status(500).json({ error: error.message });
    }
}
 

// Login User Controller
const loginUser = async(req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        
        if(!user || !isPasswordCorrect){
            return res.status(401).json({error: 'Invalid credentials'});
        } else {
            generateTokenAndSetCookie(user._id, res);
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                message: 'Logged in successfully'
            });
        }
    } catch(error) {
        res.status(500).json({error: error.message});
        console.log("Error in loginUser: ", error.message);
    }
}

// Logout User Controller
const logoutUser = (req, res) => {
    try {
        res.clearCookie("jwt", "", {maxAge:1});
        res.status(200).json({message: 'Logged out successfully'});
    } catch(error) {
        res.status(500).json({error: error.message});
        console.log("Error in logoutUser: ", error.message);
    }
}

// Follow Unfollow User Controller
const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params; // The ID of the user to follow/unfollow
        const userToModify = await User.findById(id); // Find the user to be followed/unfollowed
        const currentUser = await User.findById(req.user._id); // Find the current user (should be logged in)

        if (id === req.user._id) return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

        const isFollowing = currentUser.following.includes(id); // Check if the current user is already following the user to modify
        if (isFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            res.status(200).json({ error: "User unfollowed successfully" });
        } else {
            // Follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ error: "User followed successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in followUnfollowUser: ", error.message);
    }
}

// Update User Controller
const updateUser = async (req, res) => {
    const { name, email, username, password, profilePic, bio } = req.body;
    const userId = req.user._id;

    console.log("Update User Request Body:", req.body); // Add logging

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if(req.params.id !== userId.toString()) 
            return res.status(400).json({error: "you cannot update other user's profile"})

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        await user.save();

        res.status(200).json({
            error: "Profile updated successfully",
            updatedUser: user // Send updated user data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in updateUser:", error.message);
    }
};

export { getUserProfile, signupUser, loginUser, logoutUser, followUnfollowUser, updateUser };
