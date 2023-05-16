#!/bin/sh

corbado login --projectID $PROJECT_ID --cliSecret $CLI_SECRET
npm run install && npm run dev
sleep 10
corbado subscribe --projectID $PROJECT_ID --cliSecret $CLI_SECRET http://localhost:3000
