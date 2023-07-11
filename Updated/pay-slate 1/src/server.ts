import { config } from "dotenv";
config();
import http from "http";
import {app} from "./config/app"
import Logger from "./helper/logger";


const port = process.env["PORT"];

const server = http.createServer(app);

server.listen(port, () =>
	Logger.info(`Server running on port: ${port}`)
);
