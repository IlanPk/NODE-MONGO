"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const postController_1 = require("../controllers/postController");
const router = (0, express_1.Router)();
router.post('/', auth_1.default, postController_1.createPost);
router.get('/', postController_1.getAllPosts);
router.get('/:id', postController_1.getPostById);
router.put('/:id', auth_1.default, postController_1.updatePost);
router.delete('/:id', auth_1.default, postController_1.deletePost);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map