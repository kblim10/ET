import { Request, Response } from 'express';
import Post, { IPost } from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';

// Get all community posts
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const tag = req.query.tag as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;
    const filter: any = { isApproved: true };

    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(filter)
      .populate('author', 'fullName email profileImage role')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Add like count and user like status
    const postsWithDetails = await Promise.all(posts.map(async (post) => {
      const likeCount = post.likes.length;
      const isLikedByUser = req.user ? post.likes.includes(req.user._id) : false;
      
      // Get comment count
      const commentCount = await Comment.countDocuments({ 
        post: post._id, 
        isApproved: true 
      });

      return {
        ...post.toObject(),
        likeCount,
        isLikedByUser,
        commentCount
      };
    }));

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: {
        posts: postsWithDetails,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get post by ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({ _id: id, isApproved: true })
      .populate('author', 'fullName email profileImage role');

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found'
      });
      return;
    }

    // Increment view count
    post.views += 1;
    await post.save();

    // Get comments
    const comments = await Comment.find({ post: id, isApproved: true })
      .populate('author', 'fullName email profileImage role')
      .sort({ createdAt: -1 });

    const likeCount = post.likes.length;
    const isLikedByUser = req.user ? post.likes.includes(req.user._id) : false;

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: {
        ...post.toObject(),
        likeCount,
        isLikedByUser,
        comments
      }
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { title, content, category, tags, mediaUrl, mediaType } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({
        success: false,
        message: 'Title, content, and category are required'
      });
      return;
    }

    // Auto-approve posts from teachers and superadmin
    const isApproved = req.user.role === 'guru' || req.user.role === 'superadmin';

    const newPost = new Post({
      title,
      content,
      category,
      tags: tags || [],
      mediaUrl,
      mediaType,
      author: req.user._id,
      isApproved
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'fullName email profileImage role');

    res.status(201).json({
      success: true,
      message: isApproved ? 'Post created successfully' : 'Post created and pending approval',
      data: populatedPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found'
      });
      return;
    }

    // Check if user is the author or moderator
    if (req.user.role !== 'superadmin' && 
        req.user.role !== 'guru' && 
        post.author.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own posts'
      });
      return;
    }

    const allowedUpdates = ['title', 'content', 'category', 'tags', 'mediaUrl', 'mediaType'];
    const updates: any = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // If content is updated, may need re-approval for non-teachers
    if (updates.content && req.user.role === 'masyarakat') {
      updates.isApproved = false;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'fullName email profileImage role');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found'
      });
      return;
    }

    // Check if user is the author or moderator
    if (req.user.role !== 'superadmin' && 
        req.user.role !== 'guru' && 
        post.author.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
      return;
    }

    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post: id });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Like/unlike post
export const toggleLikePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;

    const post = await Post.findOne({ _id: id, isApproved: true });
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found'
      });
      return;
    }

    const userIndex = post.likes.indexOf(req.user._id);
    let isLiked = false;

    if (userIndex > -1) {
      // User already liked, so unlike
      post.likes.splice(userIndex, 1);
      isLiked = false;
    } else {
      // User hasn't liked, so like
      post.likes.push(req.user._id);
      isLiked = true;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Post liked' : 'Post unliked',
      data: {
        isLiked,
        likeCount: post.likes.length
      }
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add comment to post
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    const { text, parentComment } = req.body;

    if (!text) {
      res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
      return;
    }

    const post = await Post.findOne({ _id: id, isApproved: true });
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found'
      });
      return;
    }

    // Check if parent comment exists
    if (parentComment) {
      const parentCommentExists = await Comment.findOne({ 
        _id: parentComment, 
        post: id,
        isApproved: true 
      });
      if (!parentCommentExists) {
        res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
        return;
      }
    }

    // Auto-approve comments from teachers and superadmin
    const isApproved = req.user.role === 'guru' || req.user.role === 'superadmin';

    const newComment = new Comment({
      text,
      author: req.user._id,
      post: id,
      parentComment: parentComment || null,
      isApproved
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id)
      .populate('author', 'fullName email profileImage role');

    res.status(201).json({
      success: true,
      message: isApproved ? 'Comment added successfully' : 'Comment added and pending approval',
      data: populatedComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's posts
export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'fullName email profileImage role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const postsWithDetails = await Promise.all(posts.map(async (post) => {
      const likeCount = post.likes.length;
      const commentCount = await Comment.countDocuments({ 
        post: post._id, 
        isApproved: true 
      });

      return {
        ...post.toObject(),
        likeCount,
        commentCount
      };
    }));

    const total = await Post.countDocuments({ author: req.user._id });

    res.status(200).json({
      success: true,
      message: 'User posts retrieved successfully',
      data: {
        posts: postsWithDetails,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
