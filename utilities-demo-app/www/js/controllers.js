angular.module('starter.controllers', [])

.controller('loginCtrl', function($scope, $state) {
   $scope.login = function () {
      $state.go('workItems');
   }
})

.controller('workItemsCtrl', function($scope, $state, $ionicNavBarDelegate, WorkItems) {
   $scope.items = WorkItems.items
   $ionicNavBarDelegate.showBackButton(false);
   $scope.workItem = function (id) {
      console.log("this state: " + id)
      $state.go('workItem')
   }
})

.controller('workItemCtrl', function($scope, $state, $ionicNavBarDelegate, WorkItems) {
   $ionicNavBarDelegate.showBackButton(true);
   $scope.reportEquipment = function (id) {
      console.log("this state: " + id)
      $state.go('reportEquipment')
   }
})

.controller('reportEquipmentCtrl', function($scope, $state, $ionicNavBarDelegate, WorkItems) {
   $ionicNavBarDelegate.showBackButton(true);
   $scope.submit = function (id) {
      console.log("this state: " + id)
      $state.go('workItems')
   }
});
