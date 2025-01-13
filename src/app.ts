import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewire/globalErrorHandler';
import config from './config';
import notFound from './middlewire/notFound';
import router from './routes';
import cookieParser from 'cookie-parser';

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

app.use('/api', router);

const test = async (req: Request, res: Response) => {
  const message = `PH university is running on port ${config.port}`;
  res.send(message);
};

app.get('/', test);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
