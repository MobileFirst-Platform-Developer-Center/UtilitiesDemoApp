#! /bin/bash

##############################################
#                   Login
##############################################

# check if user is logged in
auth=$(cf apps)

if [[ $auth = *"Not logged in"* ]]
    then
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

    	echo ""

    	# login to cf
    	cf login -a $url

    	# check if login was successful
    	auth=$(cf apps)

    	if [[ $auth = *"FAILED"* ]] || [[ $auth = *"Not logged in"* ]]
            then
        		echo "Login unsuccessful."
        		exit
    	fi
    elif [[ $auth = *"FAILED"* ]]
        then
        	echo "No internet connection."
        	exit
fi

##############################################
#                   Services
##############################################

# Create the Mobile Foundation service
echo ""
echo ""
echo "Provisioning Mobile Foundation..."
echo ""

cf create-service 'Mobile Foundation' 'Developer' mf-utilities

# Create the Cloudant service
echo ""
echo ""
echo "Provisioning Cloudant..."
echo ""

cf create-service cloudantNoSQLDB 'Lite' cloudant-utilities

# Create the Weather Insights service
echo ""
echo ""
echo "Provisioning Weather Insights..."
echo ""

cf create-service weatherinsights 'Free-v2' weather-utilities

##############################################
#                   Keys
##############################################

# Find out which services succeeded
serv=$(cf services)

# Add the Cloudant credentials
if [[ $serv = *"cloudant-utilities"* ]]
    then
        echo ""
        cf create-service-key cloudant-utilities Credentials
        cloudantCreds=$(cf service-key cloudant-utilities Credentials)
        cloudantHost=$(grep host <<< "$cloudantCreds" | sed 's/^.*: //' | tr -d ',"')
        cloudantPass=$(grep password <<< "$cloudantCreds" | sed 's/^.*: //' | tr -d ',"')
        cloudantUser=$(grep username <<< "$cloudantCreds" | sed 's/^.*: //' | tr -d ',"')

        url="https://$cloudantHost"
        creds="$cloudantUser:$cloudantPass"

        # Create the new database
        curl -X PUT -u $creds "$url/orders/"

        # Generate the api key
        api=$(curl -X POST -u $creds "$url/_api/v2/api_keys")
        apiKey=$(grep key <<< "$api" | sed 's/^.*: //' | tr -d ',"')
        apiPass=$(grep password <<< "$api" | sed 's/^.*: //' | tr -d ',"')

        # # Add the writing permissions
        permissions="{ \"_id\": \"security\", \"cloudant\": { \"$apiKey\": [ \"_reader\", \"_writer\" ], \"$cloudantUser\": [ \"_admin\", \"_reader\", \"_writer\", \"_replicator\" ], \"nobody\": [] } }"
        curl -u $creds "$url/_api/v2/db/orders/_security" -X PUT -H "Content-Type: application/json" -d "$permissions"

        # Populate Cloudant docs and index
        curl -X POST -u $creds "$url/orders/_bulk_docs" -H "Content-Type: application/json" -d @db.json
fi

# Add the Weather credentials
if [[ $serv = *"weather-utilities"* ]]
    then
        echo ""
        cf create-service-key weather-utilities Credentials
        weatherCreds=$(cf service-key weather-utilities Credentials)
        weatherHost=$(grep host <<< "$weatherCreds" | sed 's/^.*: //' | tr -d ',"')
        weatherPass=$(grep password <<< "$weatherCreds" | sed 's/^.*: //' | tr -d ',"')
        weatherUser=$(grep username <<< "$weatherCreds" | sed 's/^.*: //' | tr -d ',"')
fi
