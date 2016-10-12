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

public class InspectionDetails {
    private String model, serial, manufacturer, inspectedBy, failReason, fileName, notes;
    private Integer manufactureYear;
    private Date lastInspected, date;
    private boolean inspectionPass;

    /**
     * Strings
     */
    public String getModel() {
        return model;
    }
    public void setModel(String model) {
        this.model = model;
    }

    public String getSerial() {
        return serial;
    }
    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getManufacturer() {
        return manufacturer;
    }
    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getInspectedBy() {
        return inspectedBy;
    }
    public void setInspectedBy(String inspectedBy) {
        this.inspectedBy = inspectedBy;
    }

    public String getFailReason() {
        return failReason;
    }
    public void setFailReason(String failReason) {
        this.failReason = failReason;
    }

    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }

    /**
     * Integers
     */
    public Integer getManufactureYear() {
        return manufactureYear;
    }
    public void setManufactureYear(Integer manufactureYear) {
        this.manufactureYear = manufactureYear;
    }

    /**
     * Dates
     */
    public Date getLastInspected() {
        return lastInspected;
    }
    public void setLastInspected(Date lastInspected) {
        this.lastInspected = lastInspected;
    }

    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }

    /**
     * Booleans
     */
    public boolean getInspectionPass() {
        return inspectionPass;
    }
    public void setInspectionPass(boolean inspectionPass) {
        this.inspectionPass = inspectionPass;
    }

    /**
     * Methods
     */
    public boolean isValid() {
		if (nonNullAndEmpty(inspectedBy)) {
            if ((!inspectionPass && nonNullAndEmpty(failReason)) || (inspectionPass && !nonNullAndEmpty(failReason))) {
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
