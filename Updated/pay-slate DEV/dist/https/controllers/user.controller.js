"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.deleteUserProfile = exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const jwtAuth_1 = require("../../helper/jwtAuth");
const users_schema_1 = __importDefault(require("../../models/users.schema"));
const express_validator_1 = require("express-validator");
const hasher_1 = require("../../helper/hasher");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, phone, userName, password } = req.body;
    const hashPass = yield (0, hasher_1.hashPassword)(password);
    try {
        // Verify if user exist
        const user = yield users_schema_1.default.findOne({
            $or: [{ email: email.toLowerCase() }, { email: email }],
        });
        if (user)
            return res
                .status(400)
                .json({ status: 'Failed', error: 'user already exist' });
        const newUser = yield users_schema_1.default.create({
            userName: userName,
            email: email.toLowerCase(),
            phone: phone,
            password: hashPass,
        });
        const token = (0, jwtAuth_1.generateAuthToken)({ id: newUser._id, email: email });
        return res.status(201).json({
            status: 'User Created Successfully',
            user: newUser,
            token: token,
        });
    }
    catch (err) {
        return res.status(400).json({ status: 'Failed', error: err.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { userName, password } = req.body;
    try {
        const user = yield users_schema_1.default.findOne({ userName: userName });
        if (!user)
            return res
                .status(400)
                .json({ status: 'Failed', error: 'Invalid credentials' });
        // Verify password
        const verifiedPassword = yield (0, hasher_1.verifyPassword)(password, user.password);
        if (!verifiedPassword) {
            return res
                .status(400)
                .json({ status: 'Failed', error: 'Invalid credentials' });
        }
        const token = (0, jwtAuth_1.generateAuthToken)({ id: user._id, password: password });
        return res
            .status(200)
            .json({ status: 'Login Successful', user: user, token: token });
    }
    catch (err) {
        return res.status(400).json({ status: 'Failed', error: err.message });
    }
});
exports.loginUser = loginUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield users_schema_1.default.findById(id);
        if (!user)
            return res
                .status(404)
                .json({ status: 'Failed', message: 'User not found' });
        return res.status(200).json({
            status: 'Success',
            user,
        });
    }
    catch (err) {
        return res
            .status(400)
            .json({ status: 'Failed', error: 'Invalid user id' });
    }
});
exports.getUserProfile = getUserProfile;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Destruct request body parameter
        const { userName, password, phone, email } = req.body;
        // Confirm user exist
        const user = yield users_schema_1.default.findById(id);
        if (!user)
            return res
                .status(400)
                .json({ status: 'Failed', error: 'User not found' });
        if (user)
            userName.userName = user;
        if (userName) {
            // Verify username doesn't already exist
            const userCheck = yield users_schema_1.default.findOne({ userName: user });
            if (userCheck)
                return res
                    .status(400)
                    .json({ status: 'Failed', error: 'User already exist' });
            user.userName = userName;
        }
        /*
        if (phone) school.phone = phone;
        if (cac) {
            // Verify cac doesn't already exist
            const cacCheck = await School.findOne({ email: email });
            if (cacCheck)
                return res
                    .status(400)
                    .json({ status: 'Failed', error: 'CAC already exist' });
            school.cac = cac;
        }
        */
        if (password) {
            user.password = yield (0, hasher_1.hashPassword)(password);
        }
        yield user.save();
        return res.status(200).json({ status: 'Success', user: user });
    }
    catch (err) {
        return res.status(400).json({ status: 'Failed', error: err.message });
    }
});
exports.updateUserProfile = updateUserProfile;
const deleteUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield users_schema_1.default.findById(id);
        if (!user)
            return res
                .status(404)
                .json({ status: 'Failed', message: 'USer not found' });
        yield users_schema_1.default.findByIdAndDelete(id);
        return res
            .status(200)
            .json({ status: 'Success', message: 'User deleted Successfully' });
    }
    catch (err) {
        return res.status(400).json({ status: 'Failed', error: err.message });
    }
});
exports.deleteUserProfile = deleteUserProfile;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_schema_1.default.find();
        if (!users)
            return res
                .status(404)
                .json({ status: 'Failed', message: 'No result found' });
        return res.status(200).json({ status: 'Success', users: users });
    }
    catch (err) {
        return res.status(500).json({ status: 'Failed', error: err.message });
    }
});
exports.getAllUsers = getAllUsers;
