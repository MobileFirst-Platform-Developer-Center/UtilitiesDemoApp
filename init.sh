#! /bin/bash
#
# Copyright 2016 IBM Corp.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


##############################################
#                   Login
##############################################

# Color vars
YELLOW="\033[1;93m"
GREEN="\033[1;92m"
BLUE="\033[1;96m"
RED="\033[7;91m"
NC="\033[0m" # No Color

# logout from cf
cf logout

echo "Choose a location:"

# list of locations
locations="US-South
UK
Australia"

# pick a location
select loc in $locations;

do
	if [ "$loc" = "US-South" ]; then
		url="https://api.ng.bluemix.net"
        break
	elif [ "$loc" = "UK" ]; then
		url="https://api.eu-gb.bluemix.net"
        break
    elif [ "$loc" = "Australia" ]; then
		url="https://api.au-syd.bluemix.net"
        break
	else
		echo "Invalid choice"
	fi
done

echo

# login to cf
cf login -a $url

# check if login was successful
auth=$(cf apps)

if [[ $auth = *"FAILED"* ]] || [[ $auth = *"Not logged in"* ]]; then
	echo -e "${RED}Login unsuccessful.${NC}"
	exit
fi

##############################################
#                   Services
##############################################

# Create the Mobile Foundation service
echo
echo
echo -e "${YELLOW}==> Provisioning Mobile Foundation...${NC}"
echo

cf create-service 'Mobile Foundation' 'Developer' mf-utilities

# Prompt the user to start the server
echo -e "${YELLOW}==> Setting up Mobile Foundation...${NC}"
mf=$(cf service mf-utilities)
mfUrl=$(grep Dashboard <<< "$mf" | sed 's/^.*: //')

echo "The page for the server is about to open in your browser. Click the button 'Start Basic Server'."
read -p "Press any button to open the browser..."

open $mfUrl

# Create the Cloudant service
echo
echo
echo -e "${YELLOW}==> Provisioning Cloudant...${NC}"
echo

cf create-service cloudantNoSQLDB 'Lite' cloudant-utilities

# Create the Weather Insights service
echo
echo
echo -e "${YELLOW}==> Provisioning Weather Insights...${NC}"
echo

cf create-service weatherinsights 'Free-v2' weather-utilities

# Create the Watson service
echo
echo
echo -e "${YELLOW}==> Provisioning Watson Speech to Text...${NC}"
echo

cf create-service 'speech_to_text' 'standard' stt-utilities

##############################################
#                   Keys
##############################################

# Find out which services succeeded
serv=$(cf services)

# Add the Cloudant credentials
if [[ $serv = *"cloudant-utilities"* ]]; then
    echo
    echo
    echo -e "${YELLOW}==> Setting up Cloudant...${NC}"
    echo

    # Add credentials
    cf create-service-key cloudant-utilities Credentials
    cloudantCreds=$(cf service-key cloudant-utilities Credentials)
    cloudantHost=$(grep host <<< "$cloudantCreds" | sed 's/^.*: //' | tr -d ',"')
    cloudantPass=$(grep password <<< "$cloudantCreds" | sed 's/^.*: //' | tr -d ',"')
    cloudantUser=$(grep username <<< "$cloudantCreds" | sed 's/^.*: //' | tr -d ',"')

    url="https://$cloudantHost"
    creds="$cloudantUser:$cloudantPass"

    # Create the new database
    hide=$(curl -X PUT -u $creds "$url/orders/")

    # Generate the api key
    api=$(curl -X POST -u $creds "$url/_api/v2/api_keys")
    apiKey=$(grep key <<< "$api" | sed 's/^.*: //' | tr -d ',"')
    apiPass=$(grep password <<< "$api" | sed 's/^.*: //' | tr -d ',"')

    # # Add the writing permissions
    permissions="{ \"_id\": \"security\", \"cloudant\": { \"$apiKey\": [ \"_reader\", \"_writer\" ], \"$cloudantUser\": [ \"_admin\", \"_reader\", \"_writer\", \"_replicator\" ], \"nobody\": [] } }"
    hide=$(curl -X PUT -u $creds "$url/_api/v2/db/orders/_security" -H "Content-Type: application/json" -d "$permissions")

    # Populate Cloudant docs and index
    hide=$(curl -X POST -u $creds "$url/orders/_bulk_docs" -H "Content-Type: application/json" -d @db.json)
else
    echo -e "${RED}Error adding Cloudant${NC}"
fi

# Add the Weather credentials
if [[ $serv = *"weather-utilities"* ]]; then
    echo
    echo
    echo -e "${YELLOW}==> Setting up Weather Service...${NC}"
    echo

    # Add credentials
    cf create-service-key weather-utilities Credentials
    weatherCreds=$(cf service-key weather-utilities Credentials)
    weatherUser=$(grep username <<< "$weatherCreds" | sed 's/^.*: //' | tr -d ',"')
    weatherPass=$(grep password <<< "$weatherCreds" | sed 's/^.*: //' | tr -d ',"')
else
    echo -e "${RED}Error adding Weather${NC}"
fi

# Add the Watson credentials
if [[ $serv = *"stt-utilities"* ]]; then
    echo
    echo
    echo -e "${YELLOW}==> Setting up Watson Speech to Text...${NC}"
    echo

    # Add credentials
    cf create-service-key stt-utilities Credentials
    sttCreds=$(cf service-key stt-utilities Credentials)
    sttUser=$(grep username <<< "$sttCreds" | sed 's/^.*: //' | tr -d ',"')
    sttPass=$(grep password <<< "$sttCreds" | sed 's/^.*: //' | tr -d ',"')
else
    echo -e "${RED}Error adding Watson Speech to Text${NC}"
fi

##############################################
#                   Ionic
##############################################


cd utilities-demo-app

# Add platforms
echo
echo
echo -e "${YELLOW}==> Adding ios...${NC}"
echo
ionic platform add ios@latest

echo
echo
echo -e "${YELLOW}==> Adding android...${NC}"
echo
ionic platform add android@latest

# Set up ionic
echo
echo
echo -e "${YELLOW}==> Updating resources...${NC}"
echo
ionic resources

# Set up ngCordova
echo
echo
echo -e "${YELLOW}==> Installing ngCordova...${NC}"
echo
bower install ngCordova

echo
echo
echo -e "${YELLOW}==> Preparing...${NC}"
echo
ionic prepare

echo
echo
echo -e "${YELLOW}==> Building project...${NC}"
echo
ionic build

# Check if the server is runnning
apps=$(cf apps)
finished=$(grep "mf-utilities" <<< "$apps")
marks=( '/' '-' '\' '|' )
echo "The server is still starting up, this may take a few minutes."
while [[ $finished != *"1/1"* ]]; do
    counter=0
    while (( $(( $counter < 200 )) )); do
        printf '%s\r' "Waiting for server...${marks[i++ % ${#marks[@]}]}"
        sleep .05
        counter=$(( $counter + 1 ))
    done
    apps=$(cf apps)
    finished=$(grep "mf-utilities" <<< "$apps")
done

# Another 30 seconds to fix app registration issues
counter=0
while (( $(( $counter < 600 )) )); do
    printf '%s\r' "Waiting for server...${marks[i++ % ${#marks[@]}]}"
    sleep .05
    counter=$(( $counter + 1 ))
done

# Update mfpdev
serverUrl=$(grep mf-utilities <<< "$apps" | xargs | sed 's/^.* //')

echo "The page for the server is about to open in your browser. Click the eye icon next to 'Password' and copy the password into the prompt."
echo -e "${BLUE}When the page opens the server may still be starting up. Please be patient and wait for it to finish.${NC}"
echo -e "Make sure you save this password somewhere!"
read -p "Press any button to open the browser..."

open $mfUrl

read -p "Password: " serverPass

#Remove the entry for mf-utilities in case we are running this script multiple times
mfpdev server remove mf-utilities
mfpdev server add mf-utilities -u "https://$serverUrl:443" -l admin -p "$serverPass" -c mfpadmin

# Setup mfp
echo
echo
echo -e "${YELLOW}==> Registering with MFP...${NC}"
echo
mfpdev app register mf-utilities

echo
echo
echo -e "${YELLOW}==> Preparing...${NC}"
echo
ionic prepare

# Build and deploy adapters
echo
echo
echo -e "${YELLOW}==> Building and Deploying all adapters...${NC}"
echo
cd ../adapters/
for d in */ ; do
    cd $d
    pwd=$(pwd)
    # Don't deploy the Utilities adapter
    if [[ $pwd != *"/Utilities"* ]]; then
        echo -e "${YELLOW}===> $d is being built and deployed${NC}"
        mfpdev adapter build mf-utilities
        mfpdev adapter deploy mf-utilities
    else
        echo -e "${YELLOW}===> $d is being built${NC}"
        mfpdev adapter build mf-utilities
    fi
    echo -e "${YELLOW}===X $d process completed${NC}"
    cd ../
done

echo
echo -e "${YELLOW}==X init.sh has completed${NC}"

# Tell user to deploy adapter
echo
echo
echo -e "The ${BLUE}Utilities${NC} and ${BLUE}Watson{NC} adapters were unable to be deployed. You must deploy the adapters manually in the Mobile Foundation console."
echo -e "In the console select ${BLUE}Adapters${NC} on the left, click ${BLUE}Actions${NC} on the top right, and click ${BLUE}Deploy Adapter${NC}."
echo -e "Navigate to the ${BLUE}adapters/Utilities/target${NC} folder and choose ${BLUE}Utilities.adapter${NC} file."
echo -e "Then, repeate these steps but for the ${BLUE}adapters/WatsonJava/target/WatsonJava.adapter${NC} adapter file."
echo "When you are done, come back to the this terminal to find the configuration variables for the adapter."
echo
read -p "Press any button to open the Mobile First Console..."
mfpdev server console mf-utilities

# Output the Utilities variables
echo
echo -e "${GREEN}Add these credentials to the Utilities adapter on the Mobile First service.${NC}"
echo
echo "Cloudant Username: $cloudantUser"
echo "Cloudant Api Key: $apiKey"
echo "Cloudant Api Password: $apiPass"
echo "Cloudant Database Name: orders"
echo "Weather Username: $weatherUser"
echo "Weather Password: $weatherPass"

# Output the Watson variables
echo
echo -e "${GREEN}Add these credentials to the WatsonJava adapter on the Mobile First service.${NC}"
echo
echo "Username: $sttUser"
echo "Password: $sttPass"
