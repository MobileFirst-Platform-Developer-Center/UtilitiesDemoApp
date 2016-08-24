angular.module('starter.controllers', [])

.controller('loginCtrl', function($scope, $state) {
   $scope.login = function () {
      $state.go('workItems');
   }
})

.controller('workItemsCtrl', function($scope, $state,  WorkItems) {
   $scope.items = WorkItems.items
   $scope.workItem = function (id) {
      console.log("this state: " + id)
      $state.go('workItem')
   }
})

.controller('workItemCtrl', function($scope, $state,  WorkItems) {
   $scope.reportEquipment = function (id) {
      console.log("this state: " + id)
      $state.go('reportEquipment')
   }
})

.controller('reportEquipmentCtrl', function($scope, $state,  WorkItems) {
   $scope.submit = function (id) {
      console.log("this state: " + id)
      $state.go('workItems')
   }
});
