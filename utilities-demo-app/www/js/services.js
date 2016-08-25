angular.module('starter.services', [])

.factory('WorkItems', function () {
   var o = {
      items: [
         {
            name: 'part',
            id: 1
         },
         {
            name: 'cannon',
            id: 2
         },
         {
            name: 'river',
            id: 3
         }]
   }

   o.addItem = function(item){
      o.push(item);
   }

   o.removeItem = function(item){
      var index = array.indexOf(item);
      if (index > -1) {
         array.splice(index, 1);
      }
   }
   return o;
})

.factory('WorkItem', function() {
   var o = {};

   o.setWorkItem = function(workItem){
      o = workItem;
   }

   o.removeWorkItem = function(){
      o = null;
   }
   return o;
});
