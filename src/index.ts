import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import router from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT!;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api', router);

app.listen(+port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use(async (req, res) => (
  res.status(404).send('Route is no where to be found.')
));
