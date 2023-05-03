<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Passkeys integration into Amazon Cognito</h3>

  <p align="center">
    Sample project that shows how to easily integrate passkeys into your existing password-based Amazon Cognito project.
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

Passkeys are the new standard for authentication on the web. Currently, they're being rolled out by Apple, Google and Microsoft (especially on the client side). Though, not many code
example projects exists, and even less for integrating them into existing authentication and user management systems. We provided a guide that shows how to easily add
passkeys into your existing Amazon Cognito setup, while still keeping Amazon Cognito as core user management system.

For this sample, we leverage [Corbado](https://www.corbado.com)'s web components that let you integrate it in <1 hour.

Finde a detailed step-by-step tutorial here: TODO

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

The sample project uses Angular as web frontend framework and Node.js / Express as backend (both in TypeScript).

* [![Angular][Angular.io]][Angular-url]
* [![Node.js][Nodejs.org]][Nodejs-url]
* [![Express][Expressjs.com]][Express-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

We provide a docker file for quick start. Note that you need to enter Amazon Cognito and Corbado environment variables to get things working:

```
COGNITO_REGION=
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
COGNITO_CLIENT_SECRET=

CORBADO_PROJECT_ID=
CORBADO_API_SECRET=
CORBADO_WEBHOOK_USERNAME=
CORBADO_WEBHOOK_PASSWORD=
```

Start the docker container with:

```
docker compose up
```

## Integration

Please see the following link for a full step-by-step tutorial on how to integrate passkeys into Amazon Cognito: TODO

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Vincent Delitz - [@vdelitz](https://twitter.com/vdelitz) - vincent@corbado.com

Project link: [https://github.com/corbado/passkeys-amazon-cognito](https://github.com/corbado/passkeys-amazon-cognito)

Tutorial link: TODO

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->

[product-screenshot]: images/screenshot.png
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/

[Nodejs-url]: https://nodejs.org/
[Nodejs.org]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white

[Express-url]: https://expressjs.com/
[Expressjs.com]: https://img.shields.io/badge/Express-AEAEAE?style=for-the-badge&logo=express&logoColor=white
