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
exports.getAllSchool = exports.deleteSchoolProfile = exports.updateSchoolProfile = exports.getSchoolProfile = exports.loginSchool = exports.registerSchool = void 0;
const jwtAuth_1 = require("../../helper/jwtAuth");
const school_schema_1 = __importDefault(require("../../models/school.schema"));
const express_validator_1 = require("express-validator");
const hasher_1 = require("../../helper/hasher");
const registerSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, cac, password } = req.body;
    const hashPass = yield (0, hasher_1.hashPassword)(password);
    try {
        // Verify if school exist
        const school = yield school_schema_1.default.findOne({
            $or: [{ email: email.toLowerCase() }, { cac: cac }],
        });
        if (school)
            return res
                .status(400)
                .json({ status: 'Failed', error: 'School already exist' });
        const newSchool = yield school_schema_1.default.create({
            name: name,
            email: email.toLowerCase(),
            phone: phone,
            cac: cac,
            password: hashPass,
        });
        const token = (0, jwtAuth_1.generateAuthToken)({ id: newSchool._id, email: email });
        return res.status(201).json({
            status: 'Success',
            school: newSchool,
            token: token,
        });
    }
    catch (err) {
        return res.status(400).json({ status: 'Failed', error: err.message });
    }
});
exports.registerSchool = registerSchool;
const loginSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const school = yield school_schema_1.default.findOne({ email: email });
        if (!school)
            return res
                .status(400)
                .json({ status: 'Failed', error: 'Invalid credentials' });
        // Verify password
        const verifiedPassword = yield (0, hasher_1.verifyPassword)(password, school.password);
        if (!verifiedPassword) {
            return res
                .status(400)
                .json({ status: 'Failed', error: 'Invalid credentials' });
        }
        const token = (0, jwtAuth_1.generateAuthToken)({ id: school._id, email: email });
        return res
            .status(200)
            .json({ status: 'Success', school: school, token: token });
    }
    catch (err) {
        return res.status(400).json({ status: 'Failed', error: err.message });
    }
});
exports.loginSchool = loginSchool;
const getSchoolProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const school = yield school_schema_1.default.findById(id);
        if (!school)
            return res
                .status(404)
                .json({ status: 'Failed', message: 'School not found' });
        return res.status(200).json({
            status: 'Success',
            school,
        });
    }
    catch (err) {
        return res
            .status(400)
            .json({ status: 'Failed', error: 'Invalid school id' });
    }
});
exports.getSchoolProfile = getSchoolProfile;
const updateSchoolProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Destruct request body parameter
        const { name, cac, password, phone, email } = req.body;
        // Confirm user exist
        const school = yield school_schema_1.default.findById(id);
        if (!school)
            return res
                .status(400)
                .json({ status: 'Failed', error: 'School not found' });
        if (name)
            school.name = name;
        if (email) {
            // Verify email doesn't already exist
            const emailCheck = yield school_schema_1.default.findOne({ email: email });
            if (emailCheck)
                return res
                    .status(400)
                    .json({ status: 'Failed', error: 'Email already exist' });
            school.email = email;
        }
        if (phone)
            school.phone = phone;
        if (cac) {
            // Verify cac doesn't already exist
            const cacCheck = yield school_schema_1.default.findOne({ email: email });
            if (cacCheck)
                return res
                    .status(400)
                    .json({ status: 'Failed', error: 'CAC already exist' });
            school.cac = cac;
        }
        if (password) {
            school.password = yield (0, hasher_1.hashPassword)(password);
        }
        yield school.save();
        return res.status(200).json({ status: 'Success', school: school });
    }
    catch (err) {
        return res.status(400).json({ status: 'Failed', error: err.message });
    }
});
exports.updateSchoolProfile = updateSchoolProfile;
const deleteSchoolProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const school = yield school_schema_1.default.findById(id);
        if (!school)
            return res
                .status(404)
                .json({ status: 'Failed', message: 'School not found' });
        yield school_schema_1.default.findByIdAndDelete(id);
        return res
            .status(200)
            .json({ status: 'Success', message: 'School deleted' });
    }
    catch (err) {
        return res.status(400).json({ status: 'Failed', error: err.message });
    }
});
exports.deleteSchoolProfile = deleteSchoolProfile;
const getAllSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schools = yield school_schema_1.default.find();
        if (!schools)
            return res
                .status(404)
                .json({ status: 'Failed', message: 'No result found' });
        return res.status(200).json({ status: 'Success', schools: schools });
    }
    catch (err) {
        return res.status(500).json({ status: 'Failed', error: err.message });
    }
});
exports.getAllSchool = getAllSchool;
