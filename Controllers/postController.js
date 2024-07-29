import User from '../models/userModel.js';
import Post from '../models/postModel.js';

const createPost = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { postedBy, text, img } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ error: 'PostedBy and text are required' });
        }

        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to create post' });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `Text can't be more than ${maxLength} characters` });
        }

        const newPost = new Post({ postedBy, text, img });
        await newPost.save();
        res.status(201).json({ message: "Post Created Successfully" });
    } catch (err) {
        console.error('Error creating post:', err);
        return res.status(500).json({ error: 'Server Error' });
    }
}

const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } 
    catch (err) {
        console.error('Error getting post:', err);
        return res.status(500).json({ error: 'Server Error' });
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(403).json({ error: 'Unauthorized to delete post' });
        }
        
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting posts:', err);
        return res.status(500).json({ error: 'Server Error' });
    }

}

const likeUnlikePost = async (req, res) => {
    try {
        const {id:postId} = await Post.findById(req.params.id);  // Here id is renamed to postId
        const { userId } = req.user._id; 
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.likes.includes(userId)) {
            await Post.updateOne({_id:postId}, {$pull : {likes: userId}});
            return res.status(200).json({ message: 'Post unliked successfully' });
        } else {
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({ message: 'Post liked successfully' });
        }
    }
    catch (err) {
        console.error('Error finding post:', err);
        return res.status(500).json({ error: 'Server Error' });
    }
}
export { createPost , getPost , deletePost , likeUnlikePost };