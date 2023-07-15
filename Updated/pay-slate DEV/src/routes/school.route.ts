import express, { Router } from 'express';
import {
	schoolRegistrationValidator,
	schoolLoginValidator,
	updateValidator,
} from '../helper/validators/school.validation';

import {
	registerSchool,
	loginSchool,
	getSchoolProfile,
	updateSchoolProfile,
	deleteSchoolProfile,
	getAllSchool,
} from '../https/controllers/school.controller';

const router: Router = express.Router();

// Register new school
router.post('/', schoolRegistrationValidator, registerSchool);

// Login new school
router.post('/login', schoolLoginValidator, loginSchool);

// Get all school
router.get('/', getAllSchool);

// Get school profile
router
	.route('/profile/:id')
	.get(getSchoolProfile)
	.put(updateValidator, updateSchoolProfile)
	.delete(deleteSchoolProfile);

export default router;
