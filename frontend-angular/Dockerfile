# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g @angular/cli

# Expose the port used by the frontend
EXPOSE 4200

# Start the frontend using the "ng serve" command
CMD ["ng", "serve", "--host", "0.0.0.0"]
