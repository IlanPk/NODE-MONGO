import { Request, Response, NextFunction } from 'express';
import Card from '../models/Card';
import { AuthRequest, CardPayload, EditCardPayload } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';
import { validateCardCreation, validateEditCard } from '../utils/validation';

export const getAllCards = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cards = await Card.find()
      .populate('userId', 'fullName email')
      .populate('likes', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      message: 'Cards retrieved successfully',
      count: cards.length,
      cards,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserCards = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cards = await Card.find({ userId: req.user?._id })
      .populate('userId', 'fullName email')
      .populate('likes', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      message: 'User cards retrieved successfully',
      count: cards.length,
      cards,
    });
  } catch (error) {
    next(error);
  }
};

export const getCardById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const card = await Card.findById(req.params.id)
      .populate('userId', 'fullName email')
      .populate('likes', 'fullName email');

    if (!card) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Card not found',
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: 'Card retrieved successfully',
      card,
    });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = validateCardCreation(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.details[0].message,
      });
      return;
    }

    const cardData = value as CardPayload;
    const newCard = new Card({
      ...cardData,
      userId: req.user?._id,
    });

    await newCard.save();
    await newCard.populate('userId', 'fullName email');
    await newCard.populate('likes', 'fullName email');

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Card created successfully',
      card: newCard,
    });
  } catch (error) {
    next(error);
  }
};

export const editCard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Card not found',
      });
      return;
    }

    if (card.userId.toString() !== req.user?._id) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const { error, value } = validateEditCard(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.details[0].message,
      });
      return;
    }

    const cardData = value as EditCardPayload;
    Object.assign(card, cardData);
    await card.save();
    await card.populate('userId', 'fullName email');
    await card.populate('likes', 'fullName email');

    res.status(HTTP_STATUS.OK).json({
      message: 'Card updated successfully',
      card,
    });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Card not found',
      });
      return;
    }

    const userId = req.user?._id;
    const alreadyLiked = card.likes.includes(userId as any);

    if (alreadyLiked) {
      card.likes = card.likes.filter((id: any) => id.toString() !== userId);
    } else {
      card.likes.push(userId as any);
    }

    await card.save();
    await card.populate('userId', 'fullName email');
    await card.populate('likes', 'fullName email');

    res.status(HTTP_STATUS.OK).json({
      message: alreadyLiked ? 'Card unliked successfully' : 'Card liked successfully',
      card,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Card not found',
      });
      return;
    }

    if (card.userId.toString() !== req.user?._id && !req.user?.isAdmin) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    await Card.findByIdAndDelete(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      message: 'Card deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
