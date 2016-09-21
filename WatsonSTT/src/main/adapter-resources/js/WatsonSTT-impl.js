/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2016. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * @param data: The voice payload from our mobile application
               Not sure about the file type
 * @returns json list of items.
 */

function sendTextToWatson(data) {
	var input = {
	    method : 'post',
	    returnedContentType : 'xml',
	    path : getPath()
	};

	return MFP.Server.invokeHttp(input);
}

/**
 * Helper function to build the URL path.
 */
function getPath(tag){
  // Get custom properties from adapter.xml that will be set via MFP console
  var pass = MFP.Server.getPropertyValue("WatsonPass");
  var user = MFP.Server.getPropertyValue("WatsonUser");

  // The "/speech-to-text/api" portion of the URL comes from Bluemis creds page
  // Add this here since we cannot append it in 'host' property in adapter.xml
  var path = "/speech-to-text/api" + pass+user;
  return path;
}

/**
 * @returns ok
 */
function unprotected(param) {
	return {result : "Hello from unprotected resource"};
}
