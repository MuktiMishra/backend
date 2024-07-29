import express from 'express';
import {getUserProfile , signupUser , loginUser, logoutUser, followUnfollowUser , updateUser } from '../Controllers/userController.js';
import protectRoute from '../middlewares/protectRoutes.js';

const router = express.Router();

//controllers are used to handle the logic for specific routes. 
//They are functions or methods that are called when a particular route is matched.

router.get("/profile/:username" , getUserProfile)
router.post('/signup', signupUser); //signupUser is a controller 
router.post('/login', loginUser);
router.post('/logout', logoutUser); 
router.post("/follow/:id", protectRoute , followUnfollowUser); //protectRoute middleware for ensuring you cant follow someone if you arent logged in
router.post("/update/:id", protectRoute , updateUser);

export default router;