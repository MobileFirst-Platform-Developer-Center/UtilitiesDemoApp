/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015, 2016. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.sample;

import java.util.logging.Logger;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
// import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.ibm.json.java.JSONObject;
// import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.AdaptersAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;

// import java.io.IOException;

import okhttp3.Credentials;
// import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

@Path("/")
@OAuthSecurity(enabled = false)
public class WeatherInsightsResource {
	/*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	// Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(WeatherInsightsResource.class.getName());

    @Context
	AdaptersAPI adaptersAPI;

    private String getCredentials() {
        WeatherInsightsApplication app = adaptersAPI.getJaxRsApplication(WeatherInsightsApplication.class);
        if (!app.weatherUsername.isEmpty() && !app.weatherPassword.isEmpty()) {
            return Credentials.basic(app.weatherUsername, app.weatherPassword);
        } else {
            return "";
        }
    }

	// Inject the MFP configuration API:
	// @Context
	// ConfigurationAPI configApi;

    /*
     * OKHTTP
     */
    @GET
    @Path("/geocode/{zip}")
 	@Produces("application/json")
 	public Object get(@PathParam("zip") String zip) throws Exception {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
            .url("https://twcservice.mybluemix.net/api/weather/v3/location/point?postalKey=" + zip + "%3AUS&language=en-US")
            .get()
            .addHeader("Authorization", getCredentials())
            .build();

        Response response = client.newCall(request).execute();
        String body = response.body().string();
        JSONObject json = JSONObject.parse(body);

        JSONObject output = new JSONObject();
        output.put("latitude", ((JSONObject)json.get("location")).get("latitude"));
        output.put("longitude", ((JSONObject)json.get("location")).get("longitude"));
        return output;
 	}

    @GET
    @Path("/alerts/{latitude}/{longitude}")
	@Produces("application/json")
	public String get(@PathParam("latitude") String latitude, @PathParam("longitude") String longitude) throws Exception {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
            .url("https://twcservice.mybluemix.net/api/weather/v1/geocode/" + latitude + "/" + longitude + "/alerts.json?language=en-US")
            .get()
            .addHeader("Authorization", getCredentials())
            .build();

        Response response = client.newCall(request).execute();
        return response.body().string();
	}

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/WeatherInsights/resource"
	 */

	// @GET
	// @Produces(MediaType.TEXT_PLAIN)
	// public String getResourceData() {
	// 	// log message to server log
	// 	logger.info("Logging info message...");
	//
	// 	return "Hello from resource";
	// }

}
