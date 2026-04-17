"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileLoggerMiddleware = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logsDir = path_1.default.join(__dirname, '../../logs');
// Ensure logs directory exists
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
const getFormattedDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
};
const getFormattedTime = () => {
    return new Date().toISOString();
};
const fileLoggerMiddleware = (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
        const statusCode = res.statusCode;
        if (statusCode >= 400) {
            const fileName = `${getFormattedDate()}.log`;
            const filePath = path_1.default.join(logsDir, fileName);
            let errorMessage = 'Unknown error';
            try {
                if (typeof data === 'string') {
                    const parsed = JSON.parse(data);
                    errorMessage = parsed.message || 'Unknown error';
                }
                else if (data && typeof data === 'object' && 'message' in data) {
                    errorMessage = data.message;
                }
            }
            catch (e) {
                errorMessage = data?.toString() || 'Unknown error';
            }
            const logEntry = `[${getFormattedTime()}] Status: ${statusCode} | Error: ${errorMessage}\n`;
            fs_1.default.appendFileSync(filePath, logEntry, 'utf-8');
        }
        return originalSend.call(this, data);
    };
    next();
};
exports.fileLoggerMiddleware = fileLoggerMiddleware;
exports.default = exports.fileLoggerMiddleware;
//# sourceMappingURL=fileLogger.js.map