package com.ibm.test1;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.watson.developer_cloud.speech_to_text.v1.SpeechToText;
import com.ibm.watson.developer_cloud.speech_to_text.v1.model.SpeechAlternative;
import com.ibm.watson.developer_cloud.speech_to_text.v1.model.Transcript;
import com.ibm.watson.developer_cloud.speech_to_text.v1.model.SpeechResults;

import com.ibm.watson.developer_cloud.http.HttpMediaType;
import com.ibm.watson.developer_cloud.http.RequestBuilder;
import com.ibm.watson.developer_cloud.service.ServiceResponseException;
import com.ibm.watson.developer_cloud.service.BadRequestException;
import com.ibm.watson.developer_cloud.http.*;


import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import javax.net.ssl.HttpsURLConnection;
import java.security.cert.X509Certificate;
import javax.net.ssl.SSLContext;
//import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.SecureRandom;
/*
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
//import com.ibm.json.java.JSONReader;
//import org.json.*;
/*
import org.json.java.JSONArray;
import org.json.java.JSONObject;
import org.json.java.JsonReader;


import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JsonReader;
*/
import javax.json.*;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonObjectBuilder;

import org.apache.commons.codec.binary.Base64;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.commons.io.IOUtils;

//import org.glassfish.jersey.media.*;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
//http://www.javatpoint.com/jax-rs-file-upload-example

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;

import javax.ws.rs.core.*;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.container.*;

import javax.servlet.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.logging.Logger;
import java.util.Arrays;
import java.net.URL;
import java.io.FileOutputStream;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.ibm.watson.developer_cloud.text_to_speech.v1.TextToSpeech;
import com.ibm.watson.developer_cloud.text_to_speech.v1.model.Voice;



@Path("/")
public class WatsonJavaResource {

    static Logger logger = Logger.getLogger(WatsonJavaResource.class.getName());

    // Override SSL Trust manager without certificate chains validation
    TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager(){
            public X509Certificate[] getAcceptedIssuers(){return null;}
            public void checkClientTrusted(X509Certificate[] certs, String authType){}
            public void checkServerTrusted(X509Certificate[] certs, String authType){}
    }};

    @Context
    ConfigurationAPI configApi;

    // These different methods can be used to transcode the audio file into
    // a different media format if you needed to do that for some reason
    // You could also set up an endpoint for batch audio processing or other things

    // Leaving off @Consumes should catch everything, also it wont matter for mfp adapters,
    // because the client is always encoded as application/x-www-form-urlencoded
  @Logged
  @POST
  @Consumes("audio/wav")
  @Path("/upload")
  @OAuthSecurity(enabled = false)
  public Response uploadFile2(byte [] body){
    System.out.println("--- Hit 'audio/wav' consumer! ");
    //callWatson(body);
    return Response.status(200).build();

  }

  // This is the endpoint we will hit with our client
  // We need to send the data as a base64 encoded string in a FormParameters
  // then write that string to a byte array[], then a file that we can send to Watson.
  @Logged
  @POST
  @OAuthSecurity(enabled = false)
  @Path("/uploadBase64Wav")
  public Response handleUpload(@FormParam("audioFile") String base64wav, @QueryParam("keywords") String keywords, @Context HttpHeaders headers) throws Exception {

      // Convert the base64 string back into a wav file
      // http://stackoverflow.com/questions/23979842/convert-base64-string-to-image
      String base64 = base64wav.split(",")[1]; // remove the "data:audio/x-wav;base64" header
      byte[] wavBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64);
      System.out.println("bytes:" + wavBytes);
      System.out.println("Keywords:" + keywords);
      return callWatson(wavBytes, keywords);
  }


    // Receive audio file byte[], write a temp file that we send to Watson
    // Return an HTTP response with the transcript
    private Response callWatson(byte [] body, String keywords){

      SpeechToText service = new SpeechToText();

      // Get our username/password for Watson from the Adapter configuration api
      // See the MobileFirst docs. Be sure to set these values in your mfp dashboard
      service.setUsernameAndPassword(configApi.getPropertyValue("Username"), configApi.getPropertyValue("Password"));
      service.setEndPoint("https://stream.watsonplatform.net/speech-to-text/api");

      String[] arr = keywords.split(",");
      logger.warning("Keyword array:" + arr.toString());
      // having a lot of trouble with Keywords and sessionless recognize() method
      // for now, we won't be using keywords
         // Save the audio byte[] to a wav file
        String result = "";
        File soundFile = null;
        try {
            // this isn't quite working, seems like we can send a blank file
            logger.warning("Have speech file, creating temp file to send to Watson");
            logger.warning("Using these keywords:" + keywords);
            soundFile = File.createTempFile("voice", ".wav");
            FileUtils.writeByteArrayToFile(soundFile, body);
        } catch (IOException e) {
            logger.warning("No audio file received");
            e.printStackTrace();
            return Response.status(400).entity("No audio file received").build();
        }

        // Transcribe the wav file using Watson's recognize() API
        try {

          if( soundFile.exists()){
            logger.warning("Sound file exists!");
            List<Transcript> transcripts= service.recognize(soundFile, "audio/wav").getResults();

              logger.warning("Got some results!");
              for (Transcript transcript : transcripts) {
                  for (SpeechAlternative alternative : transcript.getAlternatives()) {
                      result = alternative.getTranscript() + " ";
                      logger.warning("result:" + result);
                  }
              }


              return Response.ok().entity(result).build();

          }else{
            logger.warning("----- SOUND FILE NOT FOUND, bluemix can't save file");
            return Response.status(400).entity("Sound file could not be saved to server").build();
          }



        } catch (com.ibm.watson.developer_cloud.service.BadRequestException bre){
          logger.warning("com.ibm.watson.developer_cloud.service.BadRequestException");
          logger.warning(bre.getStatusCode() + bre.getMessage() + " \n");
          return Response.status(400).entity(bre.getMessage()).build();

        } catch (Exception e){

          logger.warning("No transcript from service! Some warning!" + e.getMessage());
          e.printStackTrace();
          logger.warning("----- good luck ----");
          //logger.warning(e.getResponse().toString() + "\n");
          return Response.status(400).entity(e.getMessage()).build();
        }
    }
}
