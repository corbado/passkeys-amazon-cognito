// @ts-ignore
import {express, json} from 'express';
// @ts-ignore
import cors from 'cors';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import dotenv from 'dotenv';
import {signUp, login, logout} from './controllers/authCognitoController';
import {handleWebhook, sessionVerify} from './controllers/authCorbadoController';
import {webhookMiddleware} from 'corbado-webhook';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Normal authentication process
app.post('/api/auth/signup', signUp);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);

// Corbado passkey-first authentication
const corbadoWebhookUsername = process.env.CORBADO_WEBHOOK_USERNAME;
const corbadoWebhookPassword = process.env.CORBADO_WEBHOOK_PASSWORD;

app.post('/api/corbado/webhook', webhookMiddleware(corbadoWebhookUsername, corbadoWebhookPassword), json(), handleWebhook);
app.get('/api/corbado/sessionVerify', json(), sessionVerify);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
