# MobileFirst Utilities Adapter

*All endpoints below should be prefixed with the url `http://{MobileFirst server}/mfp/api/adapters/Utilities`*

## Document Structure

#### Work Orders

```json
{
  "_id": "303012250",
  "_rev": "10-3e60aeee4f58b3da87ee77c889c86fb4",
  "addedBy": "Cosmo Kramer",
  "assignedTo": "George Costanza",
  "location": 
  {
    "city": "Durham",
    "state": "NC",
    "street": "Main St",
    "zip": 27968
  },
  "created": "Aug 11, 2016 1:47:59 PM",
  "inspectionFinished": true,
  "details": 
  {
    "model": "Dishwasher 1",
    "serial": "123ABC",
    "manufacturer": "Sears",
    "inspectedBy": "George Costanza",
    "failReason": "Some reason here.",
    "fileName": "Sears-dishwasher1",
    "notes": "Notes go here.",
    "manufactureYear": 2016,
    "lastInspected": "Oct 20, 2013 8:00:00 PM",
    "date": "Aug 11, 2016 4:05:09 PM",
    "inspectionPass": false
  }
}
```
- Required fields
	- `addedBy`
	- `inspectionFinished` - boolean "true" or "false"
	- `location`
		- `city`
		- `state`
		- `zip`
- Conditional fields
	- `details` - only if `inspectionFinished` is "true"
	- `inspectedBy` - only if `inspectionFinished` is "true"
	- `inspectionPass` 
		- only if `inspectionFinished` is "true"
		- boolean "true" or "false"
	- `failReason` - only if `inspectionPass` is "true"
- Optional fields
	- `asignedTo`
	- `model`
	- `serial`
	- `manufacturer`
	- `manufactureYear`
	- `lastInspected`
	- `fileName`
	- `notes`
- Auto-generated fields (DO NOT USE)
	- `_id` 
		- random number from 0 - 1,000,000,000 
		- used to search for users
	- `_rev`
	- `created`
	- `date`
	- `valid` - always "true" 

## Endpoints

This is the json structure for POSTing and PUTing users: 

```json
{
  "addedBy":"Cosmo Kramer",
  "assignedTo":"George Costanza",
  "location": 
  {
    "city": "Durham",
    "state": "NC",
    "street": "Main St",
    "zip": 27968
  },
  "inspectionFinished": true,
  "details":
  {
    "model":"Dishwasher 1",
    "serial":"123ABC",
    "manufacturer":"Sears",
    "manufactureYear":2016,
    "lastInspected":"2013-10-21",
    "inspectedBy":"George Costanza",
    "inspectionPass": false,
    "failReason":"Some reason here.",
    "fileName":"Sears-dishwasher1",
    "notes":"Notes go here."
  }
}
```

### POST `/orders`
- success: 201 Created
- failure: 400 Bad Request
	- a required field is missing
- failure: 500 Internal Server Error
	- some element is the wrong type (ex- `details` is a string instead of a json object)
	- possible conflict, a document with that `_id` may already exist

### GET `/orders/{id}`
*replace {id} with `_id` from an order document*

- success: 200 OK
- failure: 404 Not Found
	- `{id}` may be wrong or the document no longer exists

### PUT `/orders/{id}`
*replace {id} with `_id` from an order document*

- success: 202 Accepted
- failure: 400 Bad Request
	- a required field is missing
- failure: 500 Internal Server Error
	- some element is the wrong type (ex- `details` is a string instead of a json object)

### DELETE `/orders/{id}`
*replace {id} with `_id` from an order document*

- success: 200 OK
- failure: 404 Not Found
	- `{id}` may be wrong or the document no longer exists

	
### GET `/users/{id}`
*replace {id} with `assignedTo` from an order document*

- success: 200 OK
- failure: 404 Not Found
	- `{id}` may be wrong or the document no longer exists
