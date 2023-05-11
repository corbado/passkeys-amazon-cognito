import {Request, Response} from "express";
// @ts-ignore
import crypto from "crypto";
// @ts-ignore
import jwt from "jsonwebtoken";
import {verifyPassword, getUserStatus, createUser, createSession} from "./authCognitoController";

const Corbado = require('corbado');
const {Webhook} = require('corbado-webhook');


require("dotenv").config({ path: '../.env' });


// Corbado Node.js SDK
const CORBADO_PROJECT_ID = process.env.CORBADO_PROJECT_ID;
const CORBADO_API_SECRET = process.env.CORBADO_API_SECRET;
const corbado = new Corbado(CORBADO_PROJECT_ID, CORBADO_API_SECRET);
const webhook = new Webhook();


export const handleWebhook = async (req: Request, res: Response) => {
    try {
        // Get the webhook action and act accordingly. Every Corbado
        // webhook has an action.

        let request: any;
        let response: any;
        console.log("BEFORE ACTION");
        switch (webhook.getAction(req)) {

            // Handle the "authMethods" action which basically checks
            // if a user exists on your side/in your database.
            case webhook.WEBHOOK_ACTION.AUTH_METHODS: {
                console.log("WEBHOOK AUTH METHODS");
                request = webhook.getAuthMethodsRequest(req);

                // Now check if the given user/username exists in your
                // database and send status. Implement getUserStatus()
                // function below.#
                console.log("BEFORE USER STATUS");

                const status = await getUserStatus(request.data.username);
                console.log("User status: ", status);
                response = webhook.getAuthMethodsResponse(status);
                res.json(response);
                break;
            }

            // Handle the "passwordVerify" action which basically checks
            // if the given username and password are valid.
            case webhook.WEBHOOK_ACTION.PASSWORD_VERIFY: {
                console.log("WEBHOOK PASSWORD VERIFY");
                request = webhook.getPasswordVerifyRequest(req);

                // Now check if the given username and password is
                // valid. Implement verifyPassword() function below.
                const isValid = await verifyPassword(request.data.username, request.data.password)
                response = webhook.getPasswordVerifyResponse(isValid);
                res.json(response);
                break;
            }
            default: {
                res.status(400).send('Bad Request');
                return;
            }
        }
    } catch (error: any) {

        // We expose the full error message here. Usually you would
        // not do this (security!) but in this case Corbado is the
        // only consumer of your webhook. The error message gets
        // logged at Corbado and helps you and us debugging your
        // webhook.
        console.log(error);

        // If something went wrong just return HTTP status
        // code 500. For successful requests Corbado always
        // expects HTTP status code 200. Everything else
        // will be treated as error.

        res.status(500).send(error.message);
        return;
    }
}

export const sessionVerify = async (req: Request, res: Response) => {
    console.log("SESSION VERIFY STARTED");

    try {
        let corbadoSessionToken = req.query["corbadoSessionToken"] as string;
        let clientInfo = corbado.utils.getClientInfo(req);
        let corbadoUser = await corbado.sessionService.verify(corbadoSessionToken, clientInfo);
        let username = JSON.parse(corbadoUser.data.userData).username;
        const exists = await getUserStatus(username);
        console.log("USER EXISTS: ", exists);

        // if the user does not yet exist in AWS Cognito, add him in AWS Cognito
        if (!exists) {
            console.log("CREATING USER...");
            await createUser(username);
        }

        // create an AWS Session
        console.log("GET AWS COGNITO SESSION TOKEN")
        let data = await createSession(username);

        //let userData = await UserApp.loginCorbado(data);

        res.json(data);
    } catch (error: any) {
        console.log(error);
        res.status(500).send(error.message)
    }
};