import bcrypt from 'bcrypt';

// Hash password to ensure it security
export const hashPassword = async (password: string): Promise<string> => {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
};

// Verify password by comparing with hashed password
export const verifyPassword = async (
	password: string,
	hash: string
): Promise<Boolean> => {
	return await bcrypt.compare(password, hash);
};
