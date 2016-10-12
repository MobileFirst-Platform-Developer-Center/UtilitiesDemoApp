'use strict';

app.controller('LoginCtrl', function ($scope, $state, Auth, $ionicHistory, $ionicPopup, WorkItems) {
	$ionicHistory.clearHistory();
	var authInProgress = false;
	$scope.credentials = {
		username: '1234',
		password: '1234',
		rememberMe: false
	};

	// Check fields not null to disable the submit button
	$scope.loginDisabled = function() {
		if (!$scope.credentials.username || !$scope.credentials.password) {
			return true;
		}
		return false;
	}

	$scope.login = function () {
		console.log("login function entered");

		// Validate input
		console.log('username and password have been provided, remember me is: ' + $scope.credentials.rememberMe);
		if ($scope.credentials.username == $scope.credentials.password) {
			console.log('username and password match, proceeding to login');
			// Proceed to login
			if (!authInProgress) {
				Auth.login($scope, $scope.credentials.username.toLowerCase(), $scope.credentials.password.toLowerCase());
				authInProgress = true;
			}
		} else {
			// Show error username / password does not match.
			var alertPopup = $ionicPopup.alert({
				title: 'Login Error',
				template: 'Username and Password do not match, please try again'
			});

			alertPopup.then(function(res) {
				console.log('No username or password provided');
			});
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
