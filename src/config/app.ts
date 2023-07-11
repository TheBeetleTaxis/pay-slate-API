import express, { json, urlencoded } from 'express';
import { Application, Request, Response } from 'express';
import Logger from '../helper/logger';
import morganMiddleware from '../helper/morganLogger';
import { db } from './database';
import cors from 'cors';
import helmet from 'helmet';

//Route import
import schoolRoute from '../routes/school.route';

const app: Application = express();

db.once('open', () => Logger.info('Database connection successful'));
db.on('error', (error) => Logger.error(error));

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(morganMiddleware);
app.use(cors());
app.use(helmet());

app.use('/api/v0/school', schoolRoute);

app.use((req: Request, res: Response) => {
	return res.status(404).json('Page not found');
});

export { app };
