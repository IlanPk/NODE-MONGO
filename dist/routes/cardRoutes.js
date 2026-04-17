"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const authorization_1 = __importDefault(require("../middleware/authorization"));
const cardController_1 = require("../controllers/cardController");
const router = (0, express_1.Router)();
// GET all cards (public)
router.get('/', cardController_1.getAllCards);
// GET user's own cards (must be before /:id to avoid route conflict)
router.get('/my-cards', auth_1.authMiddleware, cardController_1.getUserCards);
// GET card by ID (public)
router.get('/:id', cardController_1.getCardById);
// POST create card (business users)
router.post('/', auth_1.authMiddleware, cardController_1.createCard);
// PUT edit card (card creator only)
router.put('/:id', auth_1.authMiddleware, authorization_1.default, cardController_1.editCard);
// PATCH like card (authenticated users)
router.patch('/:id', auth_1.authMiddleware, cardController_1.likeCard);
// DELETE card (card creator or admin)
router.delete('/:id', auth_1.authMiddleware, authorization_1.default, cardController_1.deleteCard);
exports.default = router;
//# sourceMappingURL=cardRoutes.js.map