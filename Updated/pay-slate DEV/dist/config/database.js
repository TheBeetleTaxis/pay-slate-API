"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = (_a = process.env["MONGO_URI"]) !== null && _a !== void 0 ? _a : "mongodb://127.0.0.1:27017/test";
mongoose_1.default.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose_1.default.connection;
exports.db = db;
