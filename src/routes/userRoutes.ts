import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import isOwnerOrAdmin from '../middleware/authorization';
import {
  getAllUsers,
  getUserById,
  updateUser,
  changeBusinessStatus,
  updateBusinessNumber,
  deleteUser,
} from '../controllers/userController';

const router = Router();

// POST register (public)
router.post('/', register);

// POST login (public)
router.post('/login', login);

// GET all users (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

// GET user by ID (user themselves or admin)
router.get('/:id', authMiddleware, isOwnerOrAdmin, getUserById);

// PUT update user (user themselves)
router.put('/:id', authMiddleware, isOwnerOrAdmin, updateUser);

// PATCH change business status (user themselves)
router.patch('/:id', authMiddleware, isOwnerOrAdmin, changeBusinessStatus);

// PATCH change business number (admin only)
router.patch('/:id/business-number', authMiddleware, adminMiddleware, updateBusinessNumber);

// DELETE user (user themselves or admin)
router.delete('/:id', authMiddleware, isOwnerOrAdmin, deleteUser);

export default router;

