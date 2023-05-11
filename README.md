<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Passkeys integration into Amazon Cognito</h3>

  <p align="center">
    Sample project that shows how to integrate passkeys into your existing password-based Amazon Cognito project.
    <br />
    <br />
    <a href="https://passkeys.eu">View passkeys demo</a>
    ·
    <a href="https://github.com/corbado/passkeys-amazon-cognito/issues">Report Bug</a>
    ·
    <a href="https://github.com/corbado/passkeys-amazon-cognito/issues">Request Feature</a>
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## Overview

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Passkeys are the new standard for authentication on the web. Currently, they're being rolled out by Apple, Google and Microsoft. Though, not many code
sample projects exist, and even less for integrating them into existing authentication and user management systems. We provide a guide that shows how to easily add
passkeys into your existing Amazon Cognito project, while still keeping Amazon Cognito as core user management system.

For this sample, we leverage [Corbado](https://www.corbado.com)'s passkey-first web components that let you integrate it in <1 hour.

Finde a detailed step-by-step tutorial [here](https://www.corbado.com/blog/passkeys-amazon-cognito).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

The sample project uses Angular as web frontend framework and Node.js / Express as backend (both in TypeScript).

* [![Angular][Angular.io]][Angular-url]
* [![Node.js][Nodejs.org]][Nodejs-url]
* [![Express][Expressjs.com]][Express-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

We provide a docker file for quickly getting started. Note that you need to enter Amazon Cognito and Corbado environment variables to get things working (see `docker-compose.yml`). Besides, you may also need to copy the AWS CLI scredentials from `.aws/credentials`:

```
COGNITO_REGION=
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
COGNITO_CLIENT_SECRET=
COGNITO_JWKS=

CORBADO_PROJECT_ID=
CORBADO_API_SECRET=
CORBADO_WEBHOOK_USERNAME=
CORBADO_WEBHOOK_PASSWORD=
```

Start the docker containers with:

```
docker compose up
```

## Integration

Please see [this link](https://www.corbado.com/blog/passkeys-amazon-cognito) for a detailed step-by-step tutorial on how to integrate passkeys into Amazon Cognito.

### Sign-up flow
The following steps provide a high-level overview what happens during the passkey sign-up flow.

1. Sign-up via Corbado web component on Angular frontend
2. Sign-up handled by Corbado backend (existing users are checked via webhooks)
4. Redirect to `/api/corbado/sessionVerify` on Node.js / Express backend with corbadoSessionToken
5. API call to Corbado backend to verify corbadoSessionToken (API returns `email`)
6. API calls to create the user in Amazon Cognito
    1. AdminCreateUser (`email`=`email` returned from previous step, `email_verified`=`true`, `custom:createdByCorbado`=`true`)
    2. AdminSetUserPassword (`Username`=`email`, `Password`=`randomPassword`)
7. API calls to create session in Amazon Cognito
    1. AdminInitiateAuthCommand (`AuthFlow`=`CUSTOM_AUTH`, `USERNAME`=`email` returned from previous step, no password)
    2. AWS Lambda functions are executed
    3. RespondToAuthChallenge
8. Amazon Cognito returns JWTs (`idToken`, `accessToken`, `refreshToken`)
9. `accessToken` "saved in Angular"
10. Logged-in page in Angular verifies `accessToken` in JavaScript

### Login flow
The following steps provide a high-level overview what happens during the passkey login flow.

1. Login via Corbado web component on Angular frontend
2. Login handled by Corbado backend (existing users are checked via webhooks)
3. Redirect to `/api/corbado/sessionVerify` on Node.js / Express backend with corbadoSessionToken
4. API call to Corbado backend to verify corbadoSessionToken (API returns `email`)
5. API calls to create session in Amazon Cognito
    1. AdminInitiateAuthCommand (`AuthFlow`=`CUSTOM_AUTH`, `USERNAME`=`email` returned from previous step, no password)
    2. AWS Lambda functions are executed
    3. RespondToAuthChallenge
6. Amazon Cognito returns JWTs (`idToken`, `accessToken`, `refreshToken`)
7. `accessToken` "saved in Angular"
8. Logged-in page in Angular verifies `accessToken` in JavaScript

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Vincent Delitz - [@vdelitz](https://twitter.com/vdelitz) - vincent@corbado.com

Project link: [https://github.com/corbado/passkeys-amazon-cognito](https://github.com/corbado/passkeys-amazon-cognito)

Tutorial link: [https://www.corbado.com/blog/passkeys-amazon-cognito](https://www.corbado.com/blog/passkeys-amazon-cognito)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->

[product-screenshot]: images/screenshot.png
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/

[Nodejs-url]: https://nodejs.org/
[Nodejs.org]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white

[Express-url]: https://expressjs.com/
[Expressjs.com]: https://img.shields.io/badge/Express-AEAEAE?style=for-the-badge&logo=express&logoColor=white
