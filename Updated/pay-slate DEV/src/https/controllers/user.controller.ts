import { Request, Response } from 'express';
import { generateAuthToken } from '../../helper/jwtAuth';
import User, { SlateUsers } from '../../models/users.schema';
import { validationResult } from 'express-validator';
import { hashPassword, verifyPassword } from '../../helper/hasher';


export const registerUser = async (req: Request, res: Response) => {
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, phone, userName, password } = req.body;

	const hashPass = await hashPassword(password);

	try {
		// Verify if user exist
		const user = await User.findOne({
			$or: [{ email: email.toLowerCase() }, { email: email }],
		});
		if (user)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'user already exist' });

		const newUser: SlateUsers = await User.create({
			userName: userName,
			email: email.toLowerCase(),
			phone: phone,
			password: hashPass,
		});

		const token = generateAuthToken({ id: newUser._id, email: email });

		return res.status(201).json({
			status: 'User Created Successfully',
			user: newUser,
			token: token,
		});
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const loginUser = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { userName, password } = req.body;

	try {
		const user = await User.findOne({ userName: userName });
		if (!user)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'Invalid credentials' });
		// Verify password
		const verifiedPassword = await verifyPassword(
			password,
			user.password
		);
		if (!verifiedPassword) {
			return res
				.status(400)
				.json({ status: 'Failed', error: 'Invalid credentials' });
		}
		const token = generateAuthToken({ id: user._id, password: password });
		return res
			.status(200)
			.json({ status: 'Login Successful', user: user, token: token });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const getUserProfile = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { id } = req.params;

	try {
		const user = await User.findById(id);
		if (!user)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'User not found' });

		return res.status(200).json({
			status: 'Success',
			user,
		});
	} catch (err: any) {
		return res
			.status(400)
			.json({ status: 'Failed', error: 'Invalid user id' });
	}
};

export const updateUserProfile = async (
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
		const { userName, password, phone, email } = req.body;
		// Confirm user exist
		const user = await User.findById(id);
		if (!user)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'User not found' });

		if (user) userName.userName = user;
		if (userName) {
			// Verify username doesn't already exist
			const userCheck = await User.findOne({ userName: user });
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
			user.password = await hashPassword(password);
		}
		await user.save();
		return res.status(200).json({ status: 'Success', user: user });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const deleteUserProfile = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'USer not found' });
		await User.findByIdAndDelete(id);
		return res
			.status(200)
			.json({ status: 'Success', message: 'User deleted Successfully' });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find();

		if (!users)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'No result found' });
		return res.status(200).json({ status: 'Success', users: users });
	} catch (err: any) {
		return res.status(500).json({ status: 'Failed', error: err.message });
	}
};
