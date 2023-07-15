import { config } from "dotenv";
config();
import mongoose, { ConnectOptions } from "mongoose";

const MONGO_URI: string =
	process.env["MONGO_URI"] ?? "mongodb://127.0.0.1:27017/test";

mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as ConnectOptions);

const db = mongoose.connection;

export { db };
