import User from "../models/userModel.js";
import jwt from "jsonwebtoken";


//middleware for protecting routes

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.userId }; // Setting user ID on request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        console.log("Error in protectRoute :", error.message);
    }
}


export default protectRoute;