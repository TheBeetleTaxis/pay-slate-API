import express, { Router } from 'express';
import {
	userRegistrationValidator,
	userLoginValidator,
	userUpdateValidator,
} from '../helper/validators/user.validator';

import {
	registerUser,
	loginUser,
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
	getAllUsers,
} from '../https/controllers/user.controller';

const router: Router = express.Router();

// Register new user
router.post('/', userRegistrationValidator, registerUser);

// Login User
router.post('/login', userLoginValidator, loginUser);

// Get all users
router.get('/', getAllUsers);

// Get user profile
router
	.route('/profile/:id')
	.get(getUserProfile)
	.put(userUpdateValidator, updateUserProfile)
	.delete(deleteUserProfile);

export default router;
