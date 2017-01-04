/**
* Copyright 2016 IBM Corp.
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
package com.ibm.test1;

import javax.ws.rs.ext.Provider;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.*;
import javax.ws.rs.core.HttpHeaders;
import org.apache.http.Header;

@Logged
@Provider
public class RequestLoggingFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) {
        // Use the ContainerRequestContext to extract information from the HTTP request
        // Information such as the URI, headers and HTTP entity are available

        System.out.println("\n\n\n");
        System.out.println("===========HEADERS===========");
        //System.out.println(requestContext.getHeaders());
        MultivaluedMap<String,String> map = requestContext.getHeaders();
        for (String header : map.keySet()) {
            System.out.println(header + "=" + map.get(header));
        }

        System.out.println("===========MEDIA TYPE===========");
        System.out.println(requestContext.getMediaType());

        System.out.println("===========REQUEST===========");
        System.out.println(requestContext.getRequest());
    }
}
