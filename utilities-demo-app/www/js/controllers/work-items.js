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
		var req = new WLResourceRequest('adapters/CloudantUtilities/users', WLResourceRequest.POST, 15000);
		req.setHeader('Content-type', 'application/json');
		var name = 'George Costanza';
		console.log("making request to: " + JSON.stringify(req));

		req.send(name).then(function(response) {
			for (i = 0; i < response.responseJSON.length; i++) {
				var item = response.responseJSON[i];

				// Keep just finished item out of list (might return before cloudant is updated)
				if (WorkItems.curItem._id != item._id) {
					WorkItems.addItem(item);
				}
			}

			$scope.items = WorkItems.items;
			$scope.$apply();
			if (WorkItems.curItem._id) {
				$scope.curItem = WorkItems.curItem;
				$scope.$apply();
			}

			$scope.hide($ionicLoading);
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

	// Select the work item to report
	$scope.workItem = function(item) {
		WorkItems.setWorkItem(item);
		$state.go('reportEquipment');
	}
	$scope.loadItems();
})
