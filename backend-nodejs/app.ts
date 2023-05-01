// @ts-ignore
import express from 'express';
// @ts-ignore
import cors from 'cors';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import dotenv from 'dotenv';
import { signUp, login, logout } from './controllers/authController';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/api/auth/signup', signUp);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
