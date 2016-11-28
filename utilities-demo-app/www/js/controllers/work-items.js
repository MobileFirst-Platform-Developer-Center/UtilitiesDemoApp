app.controller('WorkItemsCtrl', function($scope, $state, $ionicNavBarDelegate, $ionicLoading, $ionicHistory, $ionicPopup, WorkItems) {
	$ionicHistory.clearHistory();
	$ionicNavBarDelegate.showBackButton(false);
	$scope.curItem = null;

	// Show weather warning popup
	$scope.warn = function(alert) {
		var output = '';
		for (i = 0; i < alert.length; i++) {
			output += 'Severity ' + alert[i].severity + '<br>    ' + alert[i].headline + '<br><br>';
		}

		var alertPopup = $ionicPopup.alert({
			title: 'Inclement weather in area!',
			template: output
		});

		alertPopup.then(function(res) {
			// do nothing
		});
	};

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
		WorkItems.clearItems();
		var req = new WLResourceRequest('adapters/Utilities/users', WLResourceRequest.POST, 15000);
		req.setHeader('Content-type', 'application/json');

		var name = 'George Costanza';

		req.send(name).then(function(response) {

            // Not sure why this JSON.parse is necessary now, but it is
            var ordersJson = JSON.parse(response.responseText);
			for (i = 0; i < ordersJson.length; i++) {
				var item = ordersJson[i];

				// Keep just finished item out of list (might return before cloudant is updated)
				if (WorkItems.curItem._id != item._id) {
					WorkItems.addItem(item);
				}
			}

			// Apply the updated items to the UI
			$scope.updateItems();

			// Call the weather update if >20 minutes
			var newDate = new Date();
			if (!WorkItems.weather.time || newDate > WorkItems.weather.time.getTime() + (20*60000)) {
				$scope.updateWeather();
			} else {
				$scope.weatherToItems();
				$scope.hide($ionicLoading);
			}

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

	// POST the zips and get weather alerts
	$scope.updateWeather = function() {
		// Clear the old weather info and update it
		WorkItems.clearWeather();
		var req = new WLResourceRequest('adapters/Utilities/weather', WLResourceRequest.POST, 15000);
		req.setHeader('Content-type', 'application/json');

		var zips = [];

		// Get list of unique zips
		for (i = 0; i < WorkItems.items.length; i++) {
			if (zips.indexOf(WorkItems.items[i].location.zip) != -1) {
				zips.push(WorkItems.items[i].location.zip);
			}
		}

		req.send(zips).then(function(response) {
			var res = response.responseJSON;

			// Set the weather and time
			WorkItems.setWeather(res);
			WorkItems.weather.time = new Date();

			// Add the weather to the work items
			$scope.weatherToItems();

			// Apply the updated items to the UI
			$scope.updateItems();

			$scope.hide($ionicLoading);
			return response.responseJSON;
		}, function(error) {
			$scope.hide($ionicLoading);

			// Alert the user it timed out
			$ionicPopup.alert({
				title: 'Request failed',
				template: 'The weather request has timed out, proceed with caution. Check your connection and try again.'
			});
			return;
		});
	}

	// Apply the update to the work items
	$scope.updateItems = function() {
		$scope.items = WorkItems.items;
		$scope.$apply();
		if (WorkItems.curItem._id) {
			$scope.curItem = WorkItems.curItem;
			$scope.$apply();
		}
	}

	// Add the saved weather JSON to the work items list
	$scope.weatherToItems = function() {
		for (i = 0; i < WorkItems.items.length; i++) {
			var zip = WorkItems.items[i].location.zip;
			if (WorkItems.weather[zip] !== null) {
				WorkItems.items[i].weather = WorkItems.weather[zip];
			} else {
				// Remove the weather if there are no alerts
				delete WorkItems.items[i].weather;
			}
		}
	}

	// Select the work item to report
	$scope.workItem = function(item) {
		WorkItems.setWorkItem(item);
		$state.go('reportEquipment');
	}
	$scope.loadItems();
})
