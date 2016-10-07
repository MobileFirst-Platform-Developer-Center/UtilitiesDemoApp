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

public class ZipCode {
    private String zip, latitude, longitude, _id, _rev;

    /**
     * Strings
     */
    public String getZip() {
        return zip;
    }
    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getLatitude() {
        return latitude;
    }
    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }
    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    /**
     * Cloudant IDs
     */
    public String get_id() {
    	return _id;
    }
    public void set_id(String _id) {
    	this._id = _id;
    }

    public String get_rev() {
    	return _rev;
    }
    public void set_rev(String _rev) {
    	this._rev = _rev;
    }

    /**
     * Methods
     */
    public boolean isValid() {
		if (nonNullAndEmpty(zip) && nonNullAndEmpty(latitude) && nonNullAndEmpty(longitude)) {
		    return true;
		}
		else {
			return false;
        }
	}

    public boolean nonNullAndEmpty(String element) {
        if (element!=null && !element.isEmpty()) {
            return true;
        }
        else {
            return false;
        }
    }

}
