"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
const fileLogger_1 = __importDefault(require("./middleware/fileLogger"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cardRoutes_1 = __importDefault(require("./routes/cardRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Connect to Database
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)(process.env.LOG_FORMAT || 'dev'));
app.use(fileLogger_1.default);
app.use(express_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/cards', cardRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});
// Error Handling Middleware
app.use(errorHandler_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map