"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const mongo_1 = require("./config/mongo");
const startServer = async () => {
    try {
        await (0, mongo_1.connectToMongo)();
        app_1.default.listen(config_1.env.port, () => {
            console.log(`[server] Server is running on http://localhost:${config_1.env.port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
