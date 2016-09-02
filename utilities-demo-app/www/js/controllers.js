angular.module('starter.controllers', [])

.controller('loginCtrl', function($scope, $state, $ionicHistory) {
   $ionicHistory.clearHistory();
   $scope.login = function () {

      // TODO: add authentication here
      $state.go('workItems');
   }
})

.controller('workItemsCtrl', function($scope, $state, $ionicNavBarDelegate, $ionicHistory, WorkItems, WorkItem) {
   // Access Cloudant and populate .items with work orders

   $scope.items = WorkItems.items
   $ionicHistory.clearHistory();
   $ionicNavBarDelegate.showBackButton(false);
   $scope.workItem = function (item) {
      console.log("this state: " + item.name)
      WorkItem.setWorkItem(item);
      $state.go('reportEquipment')
   }
})

.controller('reportEquipmentCtrl', function($scope, $state, $ionicNavBarDelegate, WorkItem) {
   $ionicNavBarDelegate.showBackButton(true);

   $scope.submit = function (id) {
      $state.go('workItems')
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
