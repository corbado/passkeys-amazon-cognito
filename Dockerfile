# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend source code to the container
COPY ./frontend-angular .

# Build the frontend
RUN npm run build -- --output-path=./dist/out

# Copy the backend source code to the container
COPY ./backend-nodejs .

# Install the dotenv package
RUN npm install dotenv --save-dev

# Copy the .env file to the container
COPY .env ./

# Load the environment variables from the .env file
RUN npx dotenv -e .env npm run build

# Set the environment variables for the backend
ENV COGNITO_REGION=$COGNITO_REGION
ENV COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
ENV COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID
ENV COGNITO_CLIENT_SECRET=$COGNITO_CLIENT_SECRET
ENV CONGITO_JWKS=$CONGITO_JWKS
ENV CORBADO_PROJECT_ID=$CORBADO_PROJECT_ID
ENV CORBADO_API_SECRET=$CORBADO_API_SECRET
ENV CORBADO_WEBHOOK_USERNAME=$CORBADO_WEBHOOK_USERNAME
ENV CORBADO_WEBHOOK_PASSWORD=$CORBADO_WEBHOOK_PASSWORD

# Expose the ports used by the frontend and backend
EXPOSE 4200
EXPOSE 3000

# Start the backend using the "npm run dev" command
CMD npm run dev
