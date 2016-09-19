/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2016. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * @param tag: a topic such as MobileFirst_Platform, Bluemix, Cordova.
 * @returns json list of items.
 */

function getFeed(data) {
	var input = {
	    method : 'get',
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
  
  // The "/speech-to-text/api" comes from Bluemix when viewing your Watson creds
  // Cannot append this to the host in adapter.xml
  var path = "/speech-to-text/api" + pass+user;
}

/**
 * @returns ok
 */
function unprotected(param) {
	return {result : "Hello from unprotected resource"};
}
