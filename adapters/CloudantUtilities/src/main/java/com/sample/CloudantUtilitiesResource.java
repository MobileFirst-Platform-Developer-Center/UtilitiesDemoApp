/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package com.sample;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.Random;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import javax.net.ssl.HttpsURLConnection;
import java.security.cert.X509Certificate;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.SecureRandom;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import com.ibm.mfp.adapter.api.AdaptersAPI;
import com.worklight.core.auth.OAuthSecurity;
import com.cloudant.client.org.lightcouch.NoDocumentException;

import com.cloudant.client.api.Database;
import com.cloudant.client.api.views.Key;


@Path("/")
@OAuthSecurity(enabled = false)
public class CloudantUtilitiesResource {
	/*
	 * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	@Context
	AdaptersAPI adaptersAPI;

	private Database getDB() throws Exception {
		CloudantUtilitiesApplication app = adaptersAPI.getJaxRsApplication(CloudantUtilitiesApplication.class);
		if (app.db != null) {
			return app.db;
		}
		throw new Exception("Unable to connect to Cloudant DB, check the configuration.");
	}

	// Override SSL Trust manager without certificate chains validation
	TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager(){
			public X509Certificate[] getAcceptedIssuers(){return null;}
			public void checkClientTrusted(X509Certificate[] certs, String authType){}
			public void checkServerTrusted(X509Certificate[] certs, String authType){}
	}};

	public void fixSSL() {
        // Initializes this context with all-trusting host verifier.
        try {
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception e) {;}
    }

	/************************************************
	 *
	 * 					WORK ORDERS
	 *
     ***********************************************/

    // Basic GET for base path
 	@GET
 	@Path("/orders")
    @Produces(MediaType.TEXT_PLAIN)
    public String post1() {
        return "Hello from resources";
    }

	// POST a work order
	@POST
    @Path("/orders")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addOrder(WorkOrder order) throws Exception {
		if(order!=null && order.isValid()) {
            // Handle SSL issue
            fixSSL();

			// Add date stamp
			order.setCreated(new Date());
			// Random int 0 to 1,000,000,000
			int id = new Random().nextInt(1000000000);
			order.set_id(Integer.toString(id));

            // Set finished date
            if (order.getInspectionFinished() && order.getDetails().getDate()==null) {
                order.getDetails().setDate(new Date());
            }

			// Handle Cloudant
			String err = getDB().post(order).getError();

			if (err != null) {
				return Response.status(500).entity(err).build();
			}
			else {
				return Response.status(201).entity(order).build();
			}

		}
		else {
			return Response.status(400).entity("Invalid work order document").build();
		}
	}

	// GET a specific work order
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/orders/{id}")
	public Response getOrder(@PathParam("id") String id) throws Exception {
        // Handle SSL issue
        fixSSL();

		try {
			WorkOrder dbOrder = getDB().find(WorkOrder.class, id);
			return Response.ok(dbOrder).build();
		} catch(NoDocumentException e){
			return Response.status(404).build();
		}
	}

	// PUT a work order
	@PUT
	@Path("/orders/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateOrder(@PathParam("id") String id, WorkOrder order) throws Exception {
        // Handle SSL issue
        fixSSL();

		WorkOrder dbOrder;

		try {
			dbOrder = getDB().find(WorkOrder.class, id);
		} catch(NoDocumentException e){
			return Response.status(404).build();
		}

		if(order!=null && order.isValid()) {
            // Set finished date
            if (order.getInspectionFinished() && order.getDetails().getDate()==null) {
                order.getDetails().setDate(new Date());
            }

            // Update all the dbOrder properties
			dbOrder.setAddedBy(order.getAddedBy());
			dbOrder.setAssignedTo(order.getAssignedTo());
			dbOrder.setLocation(order.getLocation());
            dbOrder.setInspectionFinished(order.getInspectionFinished());
            dbOrder.setDetails(order.getDetails());

			String err = getDB().update(dbOrder).getError();

			if (err != null) {
				return Response.status(500).entity(err).build();
			} else {
				return Response.status(202).entity(dbOrder).build();
			}
		}
		else {
			return Response.status(400).entity("Invalid work order document").build();
		}
	}

	// DELETE a work order
	@DELETE
	@Path("/orders/{id}")
	public Response deleteOrder(@PathParam("id") String id) throws Exception {
        // Handle SSL issue
        fixSSL();

		try {
			WorkOrder order = getDB().find(WorkOrder.class, id);
			getDB().remove(order);
			return Response.ok().build();
		} catch(NoDocumentException e){
			return Response.status(404).build();
		}
	}

	/************************************************
	 *
	 * 				USER WORK ORDERS
	 *
	 ***********************************************/

    // Basic GET for base path
  	@GET
  	@Path("/users")
    @Produces(MediaType.TEXT_PLAIN)
    public String post2() {
        return "Hello from resources";
    }

	// GET a specific user's work orders
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/users")
	public Response getOrdersByName(String name) throws Exception {
		// Handle SSL issue
		fixSSL();

		try {
			List<WorkOrder> order = getDB()
				.getViewRequestBuilder("userDoc", "userIndex")
				.newRequest(Key.Type.STRING, WorkOrder.class)
				.includeDocs(true)
				.keys(name)
				.build()
				.getResponse()
				.getDocsAs(WorkOrder.class);

			return Response.ok(order).build();

		} catch(NoDocumentException e){
			return Response.status(404).build();
		}
	}

//	// GET all docs
//	@GET
//	@Produces(MediaType.APPLICATION_JSON)
//	public Response getAllEntries() throws Exception {
//		List<User> entries = getDB().view("_all_docs").includeDocs(true).query(User.class);
//		return Response.ok(entries).build();
//	}

}
