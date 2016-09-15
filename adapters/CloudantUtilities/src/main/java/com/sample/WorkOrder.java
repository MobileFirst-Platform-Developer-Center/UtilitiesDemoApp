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

import java.util.Date;

public class WorkOrder {
    private String addedBy, assignedTo, location, _id, _rev;
    private Date created;
    private boolean inspectionFinished;
    private InspectionDetails details;

    /**
     * Strings
     */
    public String getAddedBy() {
        return addedBy;
    }
    public void setAddedBy(String addedBy) {
        this.addedBy = addedBy;
    }

    public String getAssignedTo() {
        return assignedTo;
    }
    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }

    /**
     * Dates
     */
    public Date getCreated() {
        return created;
    }
    public void setCreated(Date created) {
        this.created = created;
    }

    /**
     * Booleans
     */
    public boolean getInspectionFinished() {
        return inspectionFinished;
    }
    public void setInspectionFinished(boolean inspectionFinished) {
        this.inspectionFinished = inspectionFinished;
    }

    /**
     * InspectionDetails
     */
    public InspectionDetails getDetails() {
        return details;
    }
    public void setDetails(InspectionDetails details) {
        this.details = details;
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
		if (nonNullAndEmpty(addedBy)) {
            if ((inspectionFinished && details.isValid()) || !inspectionFinished) {
                return true;
            }
            else {
			    return false;
            }
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
