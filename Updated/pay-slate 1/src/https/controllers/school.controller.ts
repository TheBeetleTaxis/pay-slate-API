import { Request, Response } from 'express';
import { generateAuthToken } from '../../helper/jwtAuth';
import School, { ISchool } from '../../models/school.schema';
import { validationResult } from 'express-validator';
import { hashPassword, verifyPassword } from '../../helper/hasher';

export const registerSchool = async (req: Request, res: Response) => {
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, phone, cac, password } = req.body;

	const hashPass = await hashPassword(password);

	try {
		// Verify if school exist
		const school = await School.findOne({
			$or: [{ email: email.toLowerCase() }, { cac: cac }],
		});
		if (school)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'School already exist' });

		const newSchool: ISchool = await School.create({
			name: name,
			email: email.toLowerCase(),
			phone: phone,
			cac: cac,
			password: hashPass,
		});

		const token = generateAuthToken({ id: newSchool._id, email: email });

		return res.status(201).json({
			status: 'Success',
			school: newSchool,
			token: token,
		});
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const loginSchool = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	try {
		const school = await School.findOne({ email: email });
		if (!school)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'Invalid credentials' });
		// Verify password
		const verifiedPassword = await verifyPassword(
			password,
			school.password
		);
		if (!verifiedPassword) {
			return res
				.status(400)
				.json({ status: 'Failed', error: 'Invalid credentials' });
		}
		const token = generateAuthToken({ id: school._id, email: email });
		return res
			.status(200)
			.json({ status: 'Success', school: school, token: token });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const getSchoolProfile = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { id } = req.params;

	try {
		const school = await School.findById(id);
		if (!school)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'School not found' });

		return res.status(200).json({
			status: 'Success',
			school,
		});
	} catch (err: any) {
		return res
			.status(400)
			.json({ status: 'Failed', error: 'Invalid school id' });
	}
};

export const updateSchoolProfile = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { id } = req.params;
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// Destruct request body parameter
		const { name, cac, password, phone, email } = req.body;
		// Confirm user exist
		const school = await School.findById(id);
		if (!school)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'School not found' });

		if (name) school.name = name;
		if (email) {
			// Verify email doesn't already exist
			const emailCheck = await School.findOne({ email: email });
			if (emailCheck)
				return res
					.status(400)
					.json({ status: 'Failed', error: 'Email already exist' });
			school.email = email;
		}
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
		if (password) {
			school.password = await hashPassword(password);
		}
		await school.save();
		return res.status(200).json({ status: 'Success', school: school });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const deleteSchoolProfile = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { id } = req.params;
	try {
		const school = await School.findById(id);
		if (!school)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'School not found' });
		await School.findByIdAndDelete(id);
		return res
			.status(200)
			.json({ status: 'Success', message: 'School deleted' });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const getAllSchool = async (req: Request, res: Response) => {
	try {
		const schools = await School.find();

		if (!schools)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'No result found' });
		return res.status(200).json({ status: 'Success', schools: schools });
	} catch (err: any) {
		return res.status(500).json({ status: 'Failed', error: err.message });
	}
};
