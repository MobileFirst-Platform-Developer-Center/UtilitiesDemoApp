app.controller('WorkItemsCtrl', function($scope, $state, $ionicNavBarDelegate, $ionicLoading, $ionicHistory, $ionicPopup, WorkItems) {
	$ionicHistory.clearHistory();
	$ionicNavBarDelegate.showBackButton(false);
	$scope.curItem = null;

	// Show the loading popup
	$scope.show = function() {
		$ionicLoading.show({
			template: '<p>Loading work orders...</p><ion-spinner></ion-spinner>'
		});
	};

	// Hide the loading popup
	$scope.hide = function(){
		$ionicLoading.hide();
	};

	// Pull down to refresh
	$scope.doRefresh = function() {
		$scope.loadItems();

		// Stop the ion-refresher from spinning
		$scope.$broadcast('scroll.refreshComplete');
	};

	// GET the orders from cloudant
	$scope.loadItems = function() {
		$scope.show($ionicLoading);

		// Clear old items and GET new ones
		WorkItems.clear();
		var req = new WLResourceRequest('adapters/Utilities/users', WLResourceRequest.POST, 15000);
		req.setHeader('Content-type', 'application/json');

		var name = 'George Costanza';
		// console.log("making request to: " + JSON.stringify(req));

		req.send(name).then(function(response) {
			for (i = 0; i < response.responseJSON.length; i++) {
				var item = response.responseJSON[i];

				// Keep just finished item out of list (might return before cloudant is updated)
				if (WorkItems.curItem._id != item._id) {
					WorkItems.addItem(item);
				}
			}

			// $scope.items = WorkItems.items;
			// $scope.$apply();
			// if (WorkItems.curItem._id) {
			// 	$scope.curItem = WorkItems.curItem;
			// 	$scope.$apply();
			// }

			$scope.updateItems();

			// Call the weather update
			$scope.updateWeather();

			// Remove the loading popup and return
			// $scope.hide($ionicLoading);
			return response.responseJSON;
		}, function(error) {	// Handle timeout
			$scope.hide($ionicLoading);

			// Alert the user it timed out
			$ionicPopup.alert({
				title: 'Request failed',
				template: 'The work order request has timed out. Check your connection and try again.'
			});
			return;
		});
	}

	$scope.updateWeather = function() {
		var req = new WLResourceRequest('adapters/Utilities/weather', WLResourceRequest.POST, 15000);
		req.setHeader('Content-type', 'application/json');

		var zips = [];

		for (i = 0; i < WorkItems.items.length; i++) {
			if (!zips.includes(WorkItems.items[i].location.zip)) {
				zips.push(WorkItems.items[i].location.zip);
			}
		}

		req.send(zips).then(function(response) {
			var res = response.responseJSON;
			// console.log(res);
			console.log('here 1');

			for (i = 0; i < WorkItems.items.length; i++) {
				var zip = WorkItems.items[i].location.zip;
				console.log('here 2')
				if (res[zip] !== null) {
					console.log('real res');
					WorkItems.items[i].weather = res[zip];
					console.log(WorkItems.items[i].weather);
				} else {
					console.log('else')
					delete WorkItems.items[i].weather;
				}
			}

			$scope.updateItems();

			$scope.hide($ionicLoading);
			return response.responseJSON;
		}, function(error) {
			console.log('error');
			console.log(error);
			$scope.hide($ionicLoading);
			return;
		});
	}

	$scope.updateItems = function() {
		$scope.items = WorkItems.items;
		$scope.$apply();
		if (WorkItems.curItem._id) {
			$scope.curItem = WorkItems.curItem;
			$scope.$apply();
		}
	}

	// Select the work item to report
	$scope.workItem = function(item) {
		WorkItems.setWorkItem(item);
		$state.go('reportEquipment');
	}
	$scope.loadItems();
})
