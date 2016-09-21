app.controller('LoginCtrl', function ($scope, $state, Auth, $ionicHistory, WorkItems) {
  $ionicHistory.clearHistory();
  var authInProgress = false;

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

    authInProgress = false;
  });
});
