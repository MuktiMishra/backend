import express from 'express';
import {createPost, getPost , deletePost , likeUnlikePost, replyToPost, getFeedPost} from '../Controllers/postController.js';
import protectRoute from '../middlewares/protectRoutes.js';

const router = express.Router();

router.get('/feed',protectRoute, getFeedPost);
router.post('/create',protectRoute, createPost);
router.get('/:id',protectRoute, getPost);
router.delete('/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likeUnlikePost);
router.post('/reply/:id', protectRoute, replyToPost);

export default router;
