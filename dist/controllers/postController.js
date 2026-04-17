"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const constants_1 = require("../config/constants");
const validation_1 = require("../utils/validation");
const createPost = async (req, res, next) => {
    try {
        const { error, value } = (0, validation_1.validatePostCreation)(req.body);
        if (error) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: error.details[0].message,
            });
            return;
        }
        const postData = value;
        const newPost = new Post_1.default({
            ...postData,
            author: req.user?._id,
        });
        await newPost.save();
        await newPost.populate('author', 'fullName email');
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            message: 'Post created successfully',
            post: newPost,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPost = createPost;
const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post_1.default.find()
            .populate('author', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Posts retrieved successfully',
            count: posts.length,
            posts,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllPosts = getAllPosts;
const getPostById = async (req, res, next) => {
    try {
        const post = await Post_1.default.findById(req.params.id).populate('author', 'fullName email');
        if (!post) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: constants_1.ERROR_MESSAGES.POST_NOT_FOUND,
            });
            return;
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Post retrieved successfully',
            post,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostById = getPostById;
const updatePost = async (req, res, next) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: constants_1.ERROR_MESSAGES.POST_NOT_FOUND,
            });
            return;
        }
        if (post.author.toString() !== req.user?._id) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                message: constants_1.ERROR_MESSAGES.UNAUTHORIZED,
            });
            return;
        }
        const { error, value } = (0, validation_1.validatePostCreation)(req.body);
        if (error) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: error.details[0].message,
            });
            return;
        }
        const postData = value;
        Object.assign(post, postData);
        await post.save();
        await post.populate('author', 'fullName email');
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Post updated successfully',
            post,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res, next) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: constants_1.ERROR_MESSAGES.POST_NOT_FOUND,
            });
            return;
        }
        if (post.author.toString() !== req.user?._id) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                message: constants_1.ERROR_MESSAGES.UNAUTHORIZED,
            });
            return;
        }
        await Post_1.default.findByIdAndDelete(req.params.id);
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Post deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postController.js.map