<<<<<<< HEAD
app.controller('LoginCtrl', function ($scope, $state, Auth, $ionicHistory, WorkItems) {
  $ionicHistory.clearHistory();
  var authInProgress = false;
=======
app.controller('LoginCtrl', function($scope, $state, $ionicHistory, WorkItems) {
	$ionicHistory.clearHistory();
	$scope.login = function () {

		// TODO: Setup login credentials
>>>>>>> origin/master

  // TODO: only for testing. Remove before release
  $scope.username = '1234';
  $scope.password = '1234';

  $scope.login = function () {
    console.log("login function entered");
    if (!authInProgress) {
      Auth.login($scope, this.username.toLowerCase(), this.password.toLowerCase());
      authInProgress = true;
    }
  };

  $scope.$on('login-success', function () {
    authInProgress = false;
    $state.go('workItems');
  });

  $scope.$on('login-error', function (event, error) {
    alert(error.message);

<<<<<<< HEAD
    authInProgress = false;
  });
=======
		$state.go('workItems');
    //$state.go('reportEquipment');
	}
>>>>>>> origin/master
});
