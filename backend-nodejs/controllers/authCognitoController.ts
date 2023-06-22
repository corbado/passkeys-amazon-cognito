import {Request, Response} from "express";
import {
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    AdminGetUserCommand,
    AdminGetUserCommandInput,
    AdminInitiateAuthCommand,
    AdminInitiateAuthCommandInput,
    AdminSetUserPasswordCommand,
    AdminSetUserPasswordCommandInput, AttributeType,
    AuthFlowType,
    ChallengeNameType,
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    GlobalSignOutCommand,
    InitiateAuthCommand,
    InitiateAuthCommandInput,
    InitiateAuthCommandOutput,
    MessageActionType,
    RespondToAuthChallengeCommand,
    RespondToAuthChallengeCommandInput,
    RespondToAuthChallengeCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
// @ts-ignore
import crypto from "crypto";
// @ts-ignore
import {hashSecret, validateJWT, generatePassword} from '../utils/helper';
import {EXISTS, NOT_EXISTS} from "../utils/constants";

require("dotenv").config({path: '../.env' });


const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID || "";
const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
const region = process.env.COGNITO_REGION || "";
const poolData = {UserPoolId: userPoolId, ClientId: clientId};

const clientConfig: CognitoIdentityProviderClientConfig = {
    region: region,
};
const client = new CognitoIdentityProviderClient(clientConfig);

// old Amazon Cognito code commented out
/*export const signUp = async (req: Request, res: Response) => {
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
};*/

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


export const verifyPassword = async (email: string, password: string): Promise<boolean> => {

    if (!(email?.trim() && password?.trim())) {
        console.log("Error with email or password");
        return false;
    }
    const params: InitiateAuthCommandInput = {
        ClientId: clientId,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: hashSecret(clientSecret, email, clientId) || ""
        },
    };
    try {
        const command = new InitiateAuthCommand(params);
        const output = (await client.send(command)) as InitiateAuthCommandOutput;
        return Boolean(output.AuthenticationResult);
    } catch (error) {
        console.log("Error authenticating user:", error);
        return false;
    }
}

interface UserAttributes {
    Name: string,
    Value: string
}

export const getUserStatus = async (email: string) => {

    const params: AdminGetUserCommandInput = {
        ...poolData,
        Username: email
    };

    try {
        const command = new AdminGetUserCommand(params);
        const response = await client.send(command);

        // We add a workaround for users, as users who have never been showed a password
        // exist in Cognito (with a random password). Therefore, we introduce the
        // custom variable "createdByCorbado" in the user pool which is stored on
        // every create user event caused by the Corbado web component.

        if (!response || !response.UserAttributes || !Array.isArray(response.UserAttributes)) {
            throw new Error('Invalid response object');
        }

        let createdByCorbado: boolean = false;


        response.UserAttributes.forEach((attr: AttributeType | undefined) => {
            if (attr && attr.Name === 'custom:createdByCorbado') {
                createdByCorbado = attr.Value === 'true';
            }
        });

        // if Corbado has created the user in AWS Cognito, we send back that the user
        // is not an existing user in the sense, he existed prior to Corbado
        return {
            userStatus: EXISTS,
            createdByCorbado: createdByCorbado
        };
    } catch (error: any) {
        if (error.name === 'UserNotFoundException') {
            return {
                userStatus: NOT_EXISTS,
                createdByCorbado: false
            };
        } else {
            throw error;
        }
    }
}

interface SessionInfo {
    email: string;
    cognitoUUID: string;
    name: string;
    expires: number;
    idToken: string;
    refreshToken: string;
}


export const createSession = async (username: string): Promise<SessionInfo> => {

    console.log("START CREATE SESSION")
    const params: AdminInitiateAuthCommandInput = {
        ...poolData,
        AuthFlow: AuthFlowType.CUSTOM_AUTH,
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            SECRET_HASH : hashSecret(clientSecret, username, clientId) || ""
        },
    };

    try {
        const adminInitiateAuthCommand = new AdminInitiateAuthCommand(params);
        const response = await client.send(adminInitiateAuthCommand);

        let answer = "FAILURE";
        if (response.ChallengeParameters) {
            answer = response.ChallengeParameters.challenge;
        }

        console.log("ANSWER:", answer)
        const respondToAuthChallengeCommand: RespondToAuthChallengeCommandInput = {
            ClientId: clientId,
            ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
            ChallengeResponses: {
                ANSWER: answer,
                USERNAME: username,
                SECRET_HASH : hashSecret(clientSecret, username, clientId) || ""

            },
            Session: response.Session
        };

        const AuthChallengeCommand = new RespondToAuthChallengeCommand(respondToAuthChallengeCommand);
        const authResult = await client.send(AuthChallengeCommand) as RespondToAuthChallengeCommandOutput;

        if (authResult?.AuthenticationResult) {
            const token = await validateJWT(
                authResult.AuthenticationResult.IdToken as string
            )
            const user: any = token as any;

            return {
                email: user.email as string,
                cognitoUUID: user.sub,
                name: user.name,
                expires: user.exp,
                idToken: authResult.AuthenticationResult.IdToken as string,
                refreshToken: authResult.AuthenticationResult.RefreshToken as string,
            };
        } else throw Error("Failed to create session");
    } catch (error) {
        throw error;
    }
}


export const createUser = async (email: string) => {
    const params: AdminCreateUserCommandInput = {
        ...poolData,
        Username: email,
        DesiredDeliveryMediums: ["EMAIL"],
        UserAttributes: [
            {Name: 'email', Value: email},
            {Name: 'email_verified', Value: 'true'},
            {Name: 'custom:createdByCorbado', Value: 'true'}
        ],
        MessageAction: MessageActionType.SUPPRESS
    };
    try {
        const createUserCommand = new AdminCreateUserCommand(params);
        const responseCreateUserCommand = await client.send(createUserCommand);

        console.log("USER SUCCESSFULLY CREATED");

        const setPasswordParams: AdminSetUserPasswordCommandInput = {
            ...poolData,
            Username: email,
            Permanent: true,
            Password: generatePassword(15)
        };
        const confirmUserCommand = new AdminSetUserPasswordCommand(setPasswordParams);
        await client.send(confirmUserCommand);
        console.log("USER SUCCESSFULLY CONFIRMED");

        return responseCreateUserCommand;
    } catch (error: any) {
        console.log("Error during user creation: ", error);
        return false;
    }
}

