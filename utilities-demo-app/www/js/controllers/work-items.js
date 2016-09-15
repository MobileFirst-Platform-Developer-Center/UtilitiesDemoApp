app.controller('WorkItemsCtrl', function($scope, $state, $ionicNavBarDelegate, $ionicLoading, $ionicHistory, WorkItems) {
	$ionicHistory.clearHistory();
	$ionicNavBarDelegate.showBackButton(false);
	$scope.curItem = null;

	$scope.show = function() {
		$ionicLoading.show({
			template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		});
	};

	$scope.hide = function(){
		$ionicLoading.hide();
	};

	$scope.doRefresh = function() {
		$scope.loadItems();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.loadItems = function() {
      	$scope.show($ionicLoading);

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

        $scope.hide($ionicLoading);
        return response.responseJSON;
      });
      }

      $scope.workItem = function(item) {
      	WorkItems.setWorkItem(item);
      	$state.go('reportEquipment');
      }

      $scope.loadItems();
    })