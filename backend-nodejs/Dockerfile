# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install


# Expose the port used by the backend
EXPOSE 3000

# Start the backend using the "npm run dev" command
CMD ["npm", "run", "dev"]
