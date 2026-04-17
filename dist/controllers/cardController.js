"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCard = exports.likeCard = exports.editCard = exports.createCard = exports.getCardById = exports.getUserCards = exports.getAllCards = void 0;
const Card_1 = __importDefault(require("../models/Card"));
const constants_1 = require("../config/constants");
const validation_1 = require("../utils/validation");
const getAllCards = async (req, res, next) => {
    try {
        const cards = await Card_1.default.find()
            .populate('userId', 'fullName email')
            .populate('likes', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Cards retrieved successfully',
            count: cards.length,
            cards,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCards = getAllCards;
const getUserCards = async (req, res, next) => {
    try {
        const cards = await Card_1.default.find({ userId: req.user?._id })
            .populate('userId', 'fullName email')
            .populate('likes', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'User cards retrieved successfully',
            count: cards.length,
            cards,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserCards = getUserCards;
const getCardById = async (req, res, next) => {
    try {
        const card = await Card_1.default.findById(req.params.id)
            .populate('userId', 'fullName email')
            .populate('likes', 'fullName email');
        if (!card) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: 'Card not found',
            });
            return;
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Card retrieved successfully',
            card,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCardById = getCardById;
const createCard = async (req, res, next) => {
    try {
        const { error, value } = (0, validation_1.validateCardCreation)(req.body);
        if (error) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: error.details[0].message,
            });
            return;
        }
        const cardData = value;
        const newCard = new Card_1.default({
            ...cardData,
            userId: req.user?._id,
        });
        await newCard.save();
        await newCard.populate('userId', 'fullName email');
        await newCard.populate('likes', 'fullName email');
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            message: 'Card created successfully',
            card: newCard,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCard = createCard;
const editCard = async (req, res, next) => {
    try {
        const card = await Card_1.default.findById(req.params.id);
        if (!card) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: 'Card not found',
            });
            return;
        }
        if (card.userId.toString() !== req.user?._id) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                message: constants_1.ERROR_MESSAGES.UNAUTHORIZED,
            });
            return;
        }
        const { error, value } = (0, validation_1.validateEditCard)(req.body);
        if (error) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: error.details[0].message,
            });
            return;
        }
        const cardData = value;
        Object.assign(card, cardData);
        await card.save();
        await card.populate('userId', 'fullName email');
        await card.populate('likes', 'fullName email');
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Card updated successfully',
            card,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.editCard = editCard;
const likeCard = async (req, res, next) => {
    try {
        const card = await Card_1.default.findById(req.params.id);
        if (!card) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: 'Card not found',
            });
            return;
        }
        const userId = req.user?._id;
        const alreadyLiked = card.likes.includes(userId);
        if (alreadyLiked) {
            card.likes = card.likes.filter((id) => id.toString() !== userId);
        }
        else {
            card.likes.push(userId);
        }
        await card.save();
        await card.populate('userId', 'fullName email');
        await card.populate('likes', 'fullName email');
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: alreadyLiked ? 'Card unliked successfully' : 'Card liked successfully',
            card,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.likeCard = likeCard;
const deleteCard = async (req, res, next) => {
    try {
        const card = await Card_1.default.findById(req.params.id);
        if (!card) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: 'Card not found',
            });
            return;
        }
        if (card.userId.toString() !== req.user?._id && !req.user?.isAdmin) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                message: constants_1.ERROR_MESSAGES.UNAUTHORIZED,
            });
            return;
        }
        await Card_1.default.findByIdAndDelete(req.params.id);
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Card deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCard = deleteCard;
//# sourceMappingURL=cardController.js.map