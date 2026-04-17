import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import isOwnerOrAdmin from '../middleware/authorization';
import {
  getAllCards,
  getUserCards,
  getCardById,
  createCard,
  editCard,
  likeCard,
  deleteCard,
} from '../controllers/cardController';

const router = Router();

// GET all cards (public)
router.get('/', getAllCards);

// GET user's own cards (must be before /:id to avoid route conflict)
router.get('/my-cards', authMiddleware, getUserCards);

// GET card by ID (public)
router.get('/:id', getCardById);

// POST create card (business users)
router.post('/', authMiddleware, createCard);

// PUT edit card (card creator only)
router.put('/:id', authMiddleware, isOwnerOrAdmin, editCard);

// PATCH like card (authenticated users)
router.patch('/:id', authMiddleware, likeCard);

// DELETE card (card creator or admin)
router.delete('/:id', authMiddleware, isOwnerOrAdmin, deleteCard);

export default router;
