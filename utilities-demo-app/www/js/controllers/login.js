'use strict';
/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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
				Auth.login($scope, $scope.credentials.username.toLowerCase(), $scope.credentials.password.toLowerCase(), $scope.credentials.rememberMe);
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
