"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/applications', applicationRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
}
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch((error) => {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';
    console.error(`MongoDB connection failed: ${message}`);
    process.exit(1);
});
