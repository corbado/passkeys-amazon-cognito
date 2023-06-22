// @ts-ignore
const express = require( 'express');
// @ts-ignore
import cors from 'cors';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import dotenv from 'dotenv';
import {signUp, login, logout} from './controllers/authCognitoController';
import {handleWebhook, sessionVerify} from './controllers/authCorbadoController';
import {json} from "express";
import {SDK, Configuration} from '@corbado/node-sdk';

const projectID = process.env.CORBADO_PROJECT_ID;
const apiSecret = process.env.CORBADO_API_SECRET;
const corbadoWebhookUsername = process.env.CORBADO_WEBHOOK_USERNAME;
const corbadoWebhookPassword = process.env.CORBADO_WEBHOOK_PASSWORD;

const config = new Configuration(projectID, apiSecret);
config.webhookUsername = corbadoWebhookUsername;
config.webhookPassword = corbadoWebhookPassword;
const corbado = new SDK(config);

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Normal authentication process
app.post('/api/auth/signup', signUp);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);



app.post('/api/corbado/webhook', corbado.webhooks.middleware, json(), handleWebhook);
app.get('/api/corbado/sessionVerify', json(), sessionVerify);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
