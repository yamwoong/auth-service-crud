"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    password: {
        type: String,
        required: function () {
            return this.get('provider') === 'local';
        },
        default: null,
        select: false,
    },
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model('User', userSchema);
