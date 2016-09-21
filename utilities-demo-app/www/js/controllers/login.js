app.controller('LoginCtrl', function($scope, $state, $ionicHistory, WorkItems) {
	$ionicHistory.clearHistory();
	$scope.login = function () {

		// TODO: Setup login credentials





		$state.go('workItems');
    //$state.go('reportEquipment');
	}
});
