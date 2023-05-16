# Use an official Node.js runtime as a parent image
FROM node:16-alpine
ARG TARGETOS
ARG TARGETARCH

ENV PROJECT_ID \
    API_SECRET \
    CLI_SECRET


RUN apk add --no-cache curl

RUN apk add git

RUN curl -o /tmp/corbado_cli.tar.gz -sSL https://github.com/corbado/cli/releases/download/v1.0.2/corbado_cli_v1.0.2_${TARGETOS}_${TARGETARCH}.tar.gz && tar xfz /tmp/corbado_cli.tar.gz && mv corbado /usr/local/bin/corbado && chmod +x /usr/local/bin/corbado

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Expose the port used by the backend
EXPOSE 3000

RUN chmod +x ./bin/startup.sh

ENTRYPOINT ./bin/startup.sh
