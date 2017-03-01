(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems',FoundItems);

function FoundItems() {
  var ddo = {
    templateURL: 'foundItems.html',
    scope: {
      items: '<' //will show up in the html doc as founds.items
    }
  };

  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {


  var menu = this;

  menu.searchTerm = "";


  menu.found = function () {
    var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    promise.then(function(result) {
        //console.log(result);
        menu.MatchedItems = result;
        console.log(menu.MatchedItems);
        if (menu.MatchedItems.length == 0){
              menu.message = "Nothing Found";
              console.log(menu.message);
            }
          else{
              menu.message = "";
              }
        return menu.MatchedItems;
            
    });  
  };

  menu.removeItem = function (itemIndex) {
    console.log(menu.MatchedItems[itemIndex]);
    menu.MatchedItems.splice(itemIndex, 1);

  };


}

MenuSearchService.$inject =['$http'];
function MenuSearchService ($http) {
  var service = this;


  service.getMatchedMenuItems = function (searchTerm) {
    

  return $http({
      method: "GET",
      url: "https://davids-restaurant.herokuapp.com/menu_items.json"
    }).then(function (response) {
          var foundItems = [];
          if(searchTerm.length == 0) {
            return foundItems;
          }


      // process result and only keep items that match
      var allItems = response.data.menu_items;
      var length = allItems.length;

      for (var i = 0; i < length; i++) {
          var item = allItems[i];
          if (item.description.indexOf(searchTerm) != -1) {
            foundItems.push(item);
          }
      }
      // return processed items
      return foundItems;
  });

  }; //end of getMatchedItems

}//end of service

})();
