import { Request, Response } from 'express';
import { generateAuthToken } from '../../helper/jwtAuth';
import Company, { ICompany } from '../../models/company.schema';
import companyDataSchema, { IDocuments } from '../../models/company.schema';
import { validationResult } from 'express-validator';
import { hashPassword, verifyPassword } from '../../helper/hasher';

export const registerCompany = async (req: Request, res: Response) => {
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { companyName, phone, email, password } = req.body;
    const { businessCategory, cacCertificate, address, city, state } = req.body;

	const hashPass = await hashPassword(password);

	try {
		// Verify if company exist
		const company = await Company.findOne({
			$or: [{ email: email.toLowerCase() }, { companyName: companyName }],
		});
		if (company)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'Company already exist' });

		const newCompany: ICompany = await Company.create({
			companyName: companyName,
			email: email.toLowerCase(),
			phone: phone,
			password: hashPass,
		});

		const token = generateAuthToken({ id: newCompany._id, email: email });

		return res.status(201).json({
			status: 'Company Account Created Successful',
			company: newCompany,
			token: token,
		});
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const loginCompany = async (
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
		const company = await Company.findOne({ email: email });
		if (!company)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'Invalid credentials' });
		// Verify password
		const verifiedPassword = await verifyPassword(
			password,
			company.password
		);
		if (!verifiedPassword) {
			return res
				.status(400)
				.json({ status: 'Failed', error: 'Invalid credentials' });
		}
		const token = generateAuthToken({ id: company._id, email: email });
		return res
			.status(200)
			.json({ status: 'Success', company: company, token: token });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const getCompanyProfile = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { id } = req.params;

	try {
		const company = await Company.findById(id);
		if (!company)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'Company not found' });

		return res.status(200).json({
			status: 'Success',
			company,
		});
	} catch (err: any) {
		return res
			.status(400)
			.json({ status: 'Failed', error: 'Invalid company id' });
	}
};

export const updateCompanyProfile = async (
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
		const { companyName, email, phone, password } = req.body;
		// Confirm if company exist
		const company = await Company.findById(id);
		if (!company)
			return res
				.status(400)
				.json({ status: 'Failed', error: 'Company not found' });

		if (companyName) companyName.company = companyName;
		if (email) {
			// Verify email doesn't already exist
			const emailCheck = await Company.findOne({ email: email });
			if (emailCheck)
				return res
					.status(400)
					.json({ status: 'Failed', error: 'Email already exist' });
			company.email = email;
		}
		if (phone) company.phone = phone;

        /*
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
			company.password = await hashPassword(password);
		}
		await company.save();
		return res.status(200).json({ status: 'Success', company: company });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const deleteCompanyProfile = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { id } = req.params;
	try {
		const company = await Company.findById(id);
		if (!company)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'Company not found' });
		await Company.findByIdAndDelete(id);
		return res
			.status(200)
			.json({ status: 'Success', message: 'Company deleted' });
	} catch (err: any) {
		return res.status(400).json({ status: 'Failed', error: err.message });
	}
};

export const getAllCompany = async (req: Request, res: Response) => {
	try {
		const companies = await Company.find();

		if (!companies)
			return res
				.status(404)
				.json({ status: 'Failed', message: 'No result found' });
		return res.status(200).json({ status: 'Success', companies: companies });
	} catch (err: any) {
		return res.status(500).json({ status: 'Failed', error: err.message });
	}
};
