"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const http_1 = __importDefault(require("http"));
const app_1 = require("./config/app");
const logger_1 = __importDefault(require("./helper/logger"));
const port = process.env["PORT"];
const server = http_1.default.createServer(app_1.app);
server.listen(port, () => logger_1.default.info(`Server running on port: ${port}`));
