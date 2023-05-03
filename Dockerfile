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

# Set the environment variables for the backend
ENV COGNITO_REGION=your_cognito_region
ENV COGNITO_USER_POOL_ID=your_user_pool_id
ENV COGNITO_CLIENT_ID=your_client_id
ENV COGNITO_CLIENT_SECRET=your_client_secret
ENV CORBADO_PROJECT_ID=your_project_id
ENV CORBADO_API_SECRET=your_api_secret
ENV CORBADO_WEBHOOK_USERNAME=your_webhook_username
ENV CORBADO_WEBHOOK_PASSWORD=your_webhook_password

# Expose the ports used by the frontend and backend
EXPOSE 4200
EXPOSE 3000

# Start the backend using the "npm run dev" command
CMD npm run dev
