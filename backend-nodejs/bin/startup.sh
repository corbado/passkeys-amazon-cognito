#!/bin/sh

# Function to check if npm run dev is successfully spun up
function check_dev {
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
  if [[ $response == "200" ]]; then
    return 0
  else
    return 1
  fi
}

corbado login --projectID $CORBADO_PROJECT_ID --cliSecret $CORBADO_CLI_SECRET

# Install dependencies and start npm run dev
npm install && npm run dev &

# Wait for npm run dev to spin up successfully
#while ! check_dev; do
#   sleep 1
#   echo "Looping/sleeping"
# done

# Wait for an additional 10 seconds to ensure the application is fully running
sleep 10

echo "Running corbado subscribe"

# Subscribe to Corbado
corbado subscribe --projectID $CORBADO_PROJECT_ID --cliSecret $CORBADO_CLI_SECRET http://localhost:3000