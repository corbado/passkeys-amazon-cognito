import {Request, Response} from "express";
import {
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    AdminSetUserPasswordCommand,
    AdminSetUserPasswordCommandInput,
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    GlobalSignOutCommand,
    InitiateAuthCommand,
    MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";
// @ts-ignore
import crypto from "crypto";

require("dotenv").config();


const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;
const clientSecret = process.env.COGNITO_CLIENT_SECRET
const poolData = {UserPoolId: userPoolId, ClientId: clientId};

const clientConfig: CognitoIdentityProviderClientConfig = {
    region: 'eu-central-1',
};
const client = new CognitoIdentityProviderClient(clientConfig);

function hashSecret(clientSecret: any, username: any, clientId: any) {
    if (!clientSecret) {
        return null;
    }
    return crypto
        .createHmac("SHA256", clientSecret)
        .update(username + clientId)
        .digest("base64");
}

export const signUp = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    // Workaround, as don't want to send out confirm emails
    const paramsAdminCreateUser: AdminCreateUserCommandInput = {
        ...poolData,
        Username: email,
        DesiredDeliveryMediums: ["EMAIL"],
        UserAttributes: [
            {Name: 'email', Value: email},
            {Name: 'email_verified', Value: 'true'},
        ],
        MessageAction: MessageActionType.SUPPRESS
    };

    try {
        const createUserCommand = new AdminCreateUserCommand(paramsAdminCreateUser);
        await client.send(createUserCommand);

        console.log("USER SUCCESSFULLY CREATED");

        const paramsSetUserPassword: AdminSetUserPasswordCommandInput = {
            ...poolData,
            Username: email,
            Permanent: true,
            Password: password
        };
        const confirmUserCommand = new AdminSetUserPasswordCommand(paramsSetUserPassword);
        await client.send(confirmUserCommand);

        console.log("USER SUCCESSFULLY CONFIRMED");
        res.status(200).json({message: 'User created successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'An error occurred'});
    }
};

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const authParams = {
        ...poolData,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: ""
        },
    };
    const hash = hashSecret(clientSecret, email, clientId);
    if (hash && authParams.AuthParameters) {
        authParams.AuthParameters.SECRET_HASH = hash;
    }
    try {
        const initiateAuthCommand = new InitiateAuthCommand(authParams);
        const authResult = await client.send(initiateAuthCommand);

        if (!authResult.AuthenticationResult) {
            res.status(401).json({message: "Invalid credentials"});
            return;
        }
        res.status(200).json({token: authResult.AuthenticationResult.AccessToken});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: 'Invalid credentials'});
    }
};

export const logout = async (req: Request, res: Response) => {
    const {token} = req.body;
    const params = {
        ...poolData,
        AccessToken: token,
    };
    try {
        const globalSignOutCommand = new GlobalSignOutCommand(params);
        await client.send(globalSignOutCommand);
        res.status(200).json({message: 'User logged out successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'An error occurred'});
    }
};
