// @ts-ignore
import crypto from "crypto";
// @ts-ignore
import jwt from "jsonwebtoken";
import {int} from "aws-sdk/clients/datapipeline";
// @ts-ignore
import jwkToPem, {JWK} from "jwk-to-pem";

require("dotenv").config();

const envJWKS = process.env.COGNITO_JWKS;
const jwks: JWK[] | any[] = JSON.parse(envJWKS as string);

export function hashSecret(clientSecret: string, username: string, clientId: string) {
    if (!clientSecret) {
        return null;
    }
    return crypto
        .createHmac("SHA256", clientSecret)
        .update(username + clientId)
        .digest("base64");
}

export function validateJWT(jwtToken: string, skipExpiredCheck?: boolean) {
    if (!jwtToken.trim()) {
        console.log("Error with JWT");
        return;
    }
    let decoded = jwt.decode(jwtToken);
    const now = +new Date() / 1000;
    // @ts-ignore
    if (!skipExpiredCheck && decoded.exp < now) {
        console.log("Token expired");
        return;
    }
    // @ts-ignore
    if (decoded.aud !== clientId) {
        console.log("Invalid audience in token");
        return;
    }
    // @ts-ignore
    if (decoded.iss !== `https://cognito-idp.${region}.amazonaws.com/${poolID}`) {
        console.log("Invalid iss in token");
        return;
    }
    let res;
    try {
        let pem = jwkToPem(jwks[0]);
        res = jwt.verify(jwtToken, pem, {algorithms: jwks[0].alg});
    } catch (error) {
        let pem = jwkToPem(jwks[1]);
        res = jwt.verify(jwtToken, pem, {algorithms: jwks[1].alg});
    }
    return res;
}

export function generatePassword(length: int) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};