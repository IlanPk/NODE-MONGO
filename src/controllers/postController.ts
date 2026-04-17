import { Response, NextFunction } from 'express';
import Post from '../models/Post';
import { AuthRequest, PostPayload } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';
import { validatePostCreation } from '../utils/validation';

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = validatePostCreation(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.details[0].message,
      });
      return;
    }

    const postData = value as PostPayload;
    const newPost = new Post({
      ...postData,
      author: req.user?._id,
    });

    await newPost.save();
    await newPost.populate('author', 'fullName email');

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      message: 'Posts retrieved successfully',
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'fullName email');

    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.POST_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: 'Post retrieved successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.POST_NOT_FOUND,
      });
      return;
    }

    if (post.author.toString() !== req.user?._id) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const { error, value } = validatePostCreation(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.details[0].message,
      });
      return;
    }

    const postData = value as PostPayload;
    Object.assign(post, postData);
    await post.save();
    await post.populate('author', 'fullName email');

    res.status(HTTP_STATUS.OK).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.POST_NOT_FOUND,
      });
      return;
    }

    if (post.author.toString() !== req.user?._id) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
