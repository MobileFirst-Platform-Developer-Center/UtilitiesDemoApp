angular.module('starter.controllers', [])

.controller('loginCtrl', function($scope, $state, $ionicHistory, WorkItems) {
    $ionicHistory.clearHistory();
    $scope.login = function () {
        $state.go('workItems');
    }
})

.controller('workItemsCtrl', function($scope, $state, $ionicNavBarDelegate, $ionicHistory, WorkItems) {
   $ionicHistory.clearHistory();
   $ionicNavBarDelegate.showBackButton(false);

   $scope.curItem = null;

    $scope.doRefresh = function() {
        $scope.loadItems();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadItems = function() {
        // Clear old items and GET new ones
        WorkItems.clear();

        var req = new WLResourceRequest('adapters/CloudantUtilities/users/George Costanza', WLResourceRequest.GET);

        req.send().then(function(response){
           for (i = 0; i < response.responseJSON.length; i++) {
               var item = response.responseJSON[i];
               // Keep just finished item out of list (might return before cloudant is updated)
               if (WorkItems.curItem._id != item._id) {
                   WorkItems.addItem(item);
               }
           }

           $scope.items = WorkItems.items;

           $scope.$apply();

           $scope.notEmpty = function(json) {
               if (json._id) {
                   return true;
               }
               return false;
           }

           if (WorkItems.curItem._id) {
               $scope.curItem = WorkItems.curItem;
               $scope.$apply();
           }

        //    console.log('items: ' + $scope.items);

           return response.responseJSON;
        });
    }

   $scope.workItem = function(item) {
        WorkItems.setWorkItem(item);
        $state.go('reportEquipment');
   }

   $scope.loadItems();
})

.controller('reportEquipmentCtrl', function($scope, $state, $ionicNavBarDelegate, WorkItems) {
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
})

.controller('pictureCtrl', function($scope) {

});
