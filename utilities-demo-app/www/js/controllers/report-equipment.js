'use strict';
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
app.controller('ReportEquipmentCtrl', function($scope, $state, $ionicNavBarDelegate, $rootScope, $ionicPopup, WorkItems) {
	$ionicNavBarDelegate.showBackButton(true);
	$scope.fail = '';
	$scope.date = new Date();
	$scope.item = WorkItems.curItem;
	$scope.details = {
		'model': null,
		'serial': null,
		'manufacturer': null,
		'inspectedBy': "George Costanza",
		'failReason': null,
		'fileName': WorkItems.curItem._id + "_inspection.pdf",
		'notes': null,
		'manufactureYear': null,
		'lastInspected': null,
		'date': null,
		'inspectionPass': true
	};

	buildAddress = function(obj) {
		var address = '';
		if (obj.number != null) {
			address = address + obj.number + ' ';
		}
		if (obj.street != null) {
			address = address + obj.street + ' ';
		}
		address = address + obj.city + ', ' + obj.state + ' ' + obj.zip;
		return address;
	}

	$scope.address = buildAddress(WorkItems.curItem.location);

	// Var for original back function
	var oldSoftBack = $rootScope.$ionicGoBack;

	// Show warning popup when back is pressed
	$rootScope.$ionicGoBack = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Warning',
			template: 'The data on this page has not been submitted and will be lost. Continue?'
		});
		confirmPopup.then(function(res) {
			if(res) {
				$state.go('workItems');
			}
		});
	};

	// Show fail reason input if the inspection has failed
	$scope.showReason = function(fail) {
		if (fail == 'Fail') {
			$scope.details.inspectionPass = false;
		} else {
			$scope.details.inspectionPass = true;
		}
	}

	// Check whether to disable the submit button
	$scope.submitDisabled = function() {
		if (!$scope.details.inspectionPass && ($scope.details.failReason == null || $scope.details.failReason.length < 1)) {
			return true;
		}
		return false;
	}

	// Edit and submit to the adapter
	$scope.submit = function (details) {
		// Remove extra JSON fields
		delete WorkItems.curItem.valid;
        delete WorkItems.curItem.location.valid;
		delete WorkItems.curItem.$$hashKey;

		// Edit input values for adapter
		details.inspectionPass = $scope.details.inspectionPass;
		details.manufactureYear = parseInt(details.manufactureYear);
		WorkItems.curItem.inspectionFinished = true;
		WorkItems.curItem.details = details;

        // Clone the current item and remove the weather and created time
        var itemClone = WorkItems.curItem;
        delete itemClone.weather;
        // delete itemClone.;

        // PUT the item
		var req = new WLResourceRequest('adapters/Utilities/orders/' + itemClone._id, WLResourceRequest.PUT);
		req.setHeader('Content-type', 'application/json');
        console.log(itemClone);
		req.send(itemClone).then(
			function(response) {
                console.log('res');
                console.log(response.responseJSON);
				return response.responseJSON;
			},
			function(error) {
                console.log('error');
                console.log(error);
				return error;
			}
			);
		$state.go('workItems');
	}

	$scope.recordVoice = function () {
		navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:1});
	};

	// capture callback, from Cordova documentation
	var captureSuccess = function(mediaFiles) {
		var i, path, len;
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			path = mediaFiles[i].fullPath;
			console.log("voice file here: " + path);
		}

		// call our MFP Adapter with the voice file
		var req = new WLResourceRequest('WatsonSTT/', WLResourceRequest.POST, 15000);
		req.setHeader('Content-type', 'application/json');
		console.log("making request:" + JSON.stringify(req));
		// send it
		req.send(path).then(function(response){
			console.log("We have the watson data");
			console.log(JSON.stringify(response));
		});
	};

	// capture error callback, from Cordova documentation
	var captureError = function(error) {
		navigator.notification.alert('Could not record audio!', null, 'Recording Error');
		console.log('Error code: ' + error.code);
	};
});
