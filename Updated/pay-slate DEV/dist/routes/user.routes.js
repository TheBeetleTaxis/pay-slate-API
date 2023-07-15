"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_validator_1 = require("../helper/validators/user.validator");
const user_controller_1 = require("../https/controllers/user.controller");
const router = express_1.default.Router();
// Register new user
router.post('/', user_validator_1.userRegistrationValidator, user_controller_1.registerUser);
// Login User
router.post('/login', user_validator_1.userLoginValidator, user_controller_1.loginUser);
// Get all users
router.get('/', user_controller_1.getAllUsers);
// Get user profile
router
    .route('/profile/:id')
    .get(user_controller_1.getUserProfile)
    .put(user_validator_1.userUpdateValidator, user_controller_1.updateUserProfile)
    .delete(user_controller_1.deleteUserProfile);
exports.default = router;
