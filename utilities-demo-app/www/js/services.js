angular.module('starter.services', [])

.factory('WorkItems', function () {
   var o = {
      items: [],
      curItem: {}
   }

   o.addItem = function(item){
      o['items'].push(item);
   }

   o.removeItem = function(item){
      var index = o['items'].indexOf(item);
      if (index > -1) {
         o['items'].splice(index, 1);
      }
   }

   o.clear = function() {
       o['items'] = [];
   }

   o.setWorkItem = function(workItem){
      o['curItem'] = workItem;
   }

   o.removeWorkItem = function(){
      o['curItem'] = {};
   }

   return o;
})

// .factory('WorkItem', function() {
//    var o = {
//        item: {}
//    }
//
//    o.setWorkItem = function(workItem){
//       o['item'] = workItem;
//    }
//
//    o.removeWorkItem = function(){
//       o = null;
//    }
//    return o;
// });
