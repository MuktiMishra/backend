import express from 'express';
import {createPost, getPost , deletePost , likeUnlikePost} from '../Controllers/postController.js';
import protectRoute from '../middlewares/protectRoutes.js';

const router = express.Router();

router.post('/create',protectRoute, createPost);
router.get('/:id',protectRoute, getPost);
router.delete('/:id',protectRoute, deletePost);
router.post('/like/:id',protectRoute, likeUnlikePost);

export default router;

