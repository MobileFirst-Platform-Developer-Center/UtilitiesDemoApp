app.controller('ReportEquipmentCtrl', function($scope, $state, $ionicNavBarDelegate, $rootScope, $ionicPopup, WorkItems) {
	$ionicNavBarDelegate.showBackButton(true);
	$scope.fail = '';
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
    		} else {
                // do nothing
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

      $scope.takePicture = function () {
    //noinspection JSUnresolvedVariable
    var isEmulator = device.model.indexOf("x86") > -1;

    var cameraOptions = {
    	quality: 50,
    	destinationType: Camera.DestinationType.DATA_URL,
    	encodingType: Camera.EncodingType.PNG,
    	targetWidth: 300,
    	targetHeight: 170,
    	sourceType: isEmulator ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA
    };

    navigator.camera.getPicture(successImage, cameraError, cameraOptions);
  };

  function successImage(imgData) {
  	$scope.img = 'data:image/jpeg;base64,' + imgData;
  	$scope.$apply();
  }

  function cameraError() {
  	alert('Error taking the picture.');
  }
});