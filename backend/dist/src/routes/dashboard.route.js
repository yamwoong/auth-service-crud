"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("@middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, async (req, res) => {
    const user = req.user;
    res.status(200).json({
        message: `Welcome to your dashboard, ${user.name}!`,
        user,
    });
});
exports.default = router;
