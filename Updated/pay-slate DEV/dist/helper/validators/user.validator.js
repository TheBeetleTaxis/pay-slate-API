"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidator = exports.userLoginValidator = exports.userRegistrationValidator = void 0;
const express_validator_1 = require("express-validator");
// Validation rules
exports.userRegistrationValidator = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .isLength({ min: 2 })
        .matches(/^[A-Za-z0-9\s\-]+$/)
        .withMessage('User name must contain only alphabets, hyphen, space, and numbers, with a minimum length of 2 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong'),
    (0, express_validator_1.body)('phone')
        .trim()
        .notEmpty()
        .custom((value) => {
        // Validate phone number format (Nigeria, Ghana, and South Africa)
        const phoneRegex = /^(?:\+?(?:234|233|27))?(\d{10})$/;
        return phoneRegex.test(value);
    })
        .withMessage('Invalid phone number format'),
    (0, express_validator_1.body)('cac')
        .trim()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 14, max: 14 })
        .withMessage('CAC number must be a numeric value with exactly 14 characters'),
];
exports.userLoginValidator = [
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong'),
];
exports.userUpdateValidator = [
    (0, express_validator_1.body)('email')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong'),
    (0, express_validator_1.body)('phone')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .custom((value) => {
        // Validate phone number format (Nigeria, Ghana, and South Africa)
        const phoneRegex = /^(?:\+?(?:234|233|27))?(\d{10})$/;
        return phoneRegex.test(value);
    })
        .withMessage('Invalid phone number format'),
    (0, express_validator_1.body)('cac')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 14, max: 14 })
        .withMessage('CAC number must be a numeric value with exactly 14 characters'),
    (0, express_validator_1.body)('name')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .isLength({ min: 2 })
        .matches(/^[A-Za-z0-9\s\-]+$/)
        .withMessage('Name must contain only alphabets, hyphen, space, and numbers, with a minimum length of 2 characters'),
];
