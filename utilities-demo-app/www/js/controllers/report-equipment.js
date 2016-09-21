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
       delete WorkItems.curItem.$$hashKey;

       // Edit input values for adapter
       details.inspectionPass = $scope.details.inspectionPass;
       details.manufactureYear = parseInt(details.manufactureYear);
       WorkItems.curItem.inspectionFinished = true;

       // Set new values to body
       WorkItems.curItem.details = details;

       var req = new WLResourceRequest('adapters/CloudantUtilities/orders/' + WorkItems.curItem._id, WLResourceRequest.PUT);
       req.setHeader('Content-type', 'application/json');

        // console.log(WorkItems.curItem);

        req.send(WorkItems.curItem).then(
        	function(response) {
        		return response.responseJSON;
        	},
        	function(error) {
        		return response.responseJSON;
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
