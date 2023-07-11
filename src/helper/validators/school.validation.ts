import { body } from 'express-validator';

// Validation rules
export const schoolRegistrationValidator = [
	body('name')
		.trim()
		.notEmpty()
		.isLength({ min: 2 })
		.matches(/^[A-Za-z0-9\s\-]+$/)
		.withMessage(
			'Name must contain only alphabets, hyphen, space, and numbers, with a minimum length of 2 characters'
		),

	body('email')
		.trim()
		.notEmpty()
		.isEmail()
		.withMessage('Invalid email format'),

	body('password')
		.trim()
		.notEmpty()
		.isStrongPassword()
		.withMessage('Password must be strong'),

	body('phone')
		.trim()
		.notEmpty()
		.custom((value: string) => {
			// Validate phone number format (Nigeria, Ghana, and South Africa)
			const phoneRegex = /^(?:\+?(?:234|233|27))?(\d{10})$/;
			return phoneRegex.test(value);
		})
		.withMessage('Invalid phone number format'),

	body('cac')
		.trim()
		.notEmpty()
		.isNumeric()
		.isLength({ min: 14, max: 14 })
		.withMessage(
			'CAC number must be a numeric value with exactly 14 characters'
		),
];

export const schoolLoginValidator = [
	body('email')
		.trim()
		.notEmpty()
		.isEmail()
		.withMessage('Invalid email format'),

	body('password')
		.trim()
		.notEmpty()
		.isStrongPassword()
		.withMessage('Password must be strong'),
];

export const updateValidator = [
	body('email')
		.optional({ checkFalsy: true })
		.trim()
		.notEmpty()
		.isEmail()
		.withMessage('Invalid email format'),

	body('password')
		.optional({ checkFalsy: true })
		.trim()
		.notEmpty()
		.isStrongPassword()
		.withMessage('Password must be strong'),
	body('phone')
		.optional({ checkFalsy: true })
		.trim()
		.notEmpty()
		.custom((value: string) => {
			// Validate phone number format (Nigeria, Ghana, and South Africa)
			const phoneRegex = /^(?:\+?(?:234|233|27))?(\d{10})$/;
			return phoneRegex.test(value);
		})
		.withMessage('Invalid phone number format'),

	body('cac')
		.optional({ checkFalsy: true })
		.trim()
		.notEmpty()
		.isNumeric()
		.isLength({ min: 14, max: 14 })
		.withMessage(
			'CAC number must be a numeric value with exactly 14 characters'
		),
	body('name')
		.optional({ checkFalsy: true })
		.trim()
		.notEmpty()
		.isLength({ min: 2 })
		.matches(/^[A-Za-z0-9\s\-]+$/)
		.withMessage(
			'Name must contain only alphabets, hyphen, space, and numbers, with a minimum length of 2 characters'
		),
];
