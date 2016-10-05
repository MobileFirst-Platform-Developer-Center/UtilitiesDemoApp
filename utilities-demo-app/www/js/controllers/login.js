app.controller('LoginCtrl', function ($scope, $state, Auth, $ionicHistory, WorkItems) {
	$ionicHistory.clearHistory();
	var authInProgress = false;

	// TODO: only for testing. Remove before release
	// $scope.username = '1234';
	// $scope.password = '1234';

	$scope.login = function () {
		console.log("login function entered");

		// Validate input
		if (!$scope.username || !$scope.password) {
			console.log('No username or password provided');
		} else {
			console.log('username and password have been provided');
			if ($scope.username == $scope.password) {
				// Proceed to login
				if (!authInProgress) {
					Auth.login($scope, $scope.username.toLowerCase(), $scope.password.toLowerCase());
					authInProgress = true;
				}
			} else {
				// Show error username / password does not match.
			};
		};
	};

	$scope.$on('login-success', function () {
		authInProgress = false;
		$state.go('workItems');
	});

	$scope.$on('login-error', function (event, error) {
		alert(error.message)
		authInProgress = false;
	});
});
