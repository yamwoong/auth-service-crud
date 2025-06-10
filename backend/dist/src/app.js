"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("@config/swagger"));
const user_route_1 = __importDefault(require("@routes/user.route"));
const auth_route_1 = __importDefault(require("@routes/auth.route"));
const dashboard_route_1 = __importDefault(require("@routes/dashboard.route"));
const auth_middleware_1 = require("@middlewares/auth.middleware");
const error_middleware_1 = require("@middlewares/error.middleware");
const AppError_1 = require("@errors/AppError");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const PostController_1 = require("@controllers/PostController");
(0, routing_controllers_1.useContainer)(typedi_1.Container);
const app = (0, express_1.default)();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:8080'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
// Parse JSON bodies
// app.use(express.json());
app.use((0, cookie_parser_1.default)());
// Serve the raw OpenAPI spec for frontend or tooling
app.use('/swagger.yaml', express_1.default.static(path_1.default.resolve(process.cwd(), 'swagger.yaml')));
// Load and serve Swagger UI at /api-docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    explorer: true,
    swaggerOptions: { docExpansion: 'none' },
}));
// Public health-check endpoint
app.get('/ping', (_req, res) => {
    res.send('pong');
});
// Public user routes (no authentication)
app.use('/api/users', express_1.default.json(), user_route_1.default);
app.use('/api/auth', express_1.default.json(), auth_route_1.default);
(0, routing_controllers_1.useExpressServer)(app, {
    controllers: [PostController_1.PostController],
    routePrefix: '/api',
    defaultErrorHandler: false,
});
// Apply authentication middleware for all following routes
app.use(auth_middleware_1.authMiddleware);
app.use('/api/dashboard', express_1.default.json(), dashboard_route_1.default);
// Handle 404 for any unmatched route
app.use((_req, _res, next) => {
    next(new AppError_1.AppError('Not Found', 404));
});
// Global error handler
// Catches AppError and unexpected errors, sends JSON response
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
