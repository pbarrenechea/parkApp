angular.module('ParkApp.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('ParkCtrl', function($scope, Park, CoordinateUtils, $ionicPopup){
  var vm = this;
  vm.coordinates = {lat: 0.0, lon: 0.0};
  vm.date = undefined;

  Park.getFirst().then(function(result){
    console.log("Executing getFirst promise");
    if( typeof result !== 'undefined' ){
      vm.coordinates.lat = result.latitude;
      vm.coordinates.lon = result.longitude;
      vm.date = result.park_date;
      console.log(vm.date);
    }
  });

  vm.park = function(){
    var reqOptions = {timeout: 10000, enableHighAccuracy: false};
    navigator.geolocation
      .getCurrentPosition(function (position) {
        vm.coordinates.lat  = position.coords.latitude;
        console.log(vm.coordinates.lat);
        vm.coordinates.lon = position.coords.longitude;
        vm.date = new Date();
        console.log(vm.coordinates.lon);
        Park.clear().then(function(){
          console.log("Updating coordinates");
          Park.create( vm.coordinates.lat, vm.coordinates.lon );
        });

        $scope.$apply();
      },function(err) {
        console.log('Something went wrong');
      },
        reqOptions);
  };

  vm.clearData = function(){
    vm.coordinates.lat = 0.0;
    vm.coordinates.lon = 0.0;
    vm.date = "";
    Park.clear();
  }

  vm.reset = function(){
    Park.getFirst().then(function(result){
      if (typeof result !== 'undefined'){
        navigator.geolocation.getCurrentPosition(function (position) {
          if( CoordinateUtils.getDistance(vm.coordinates.lat, vm.coordinates.lon, position.coords.latitude ,position.coords.longitude) > 10 ){
          //if( CoordinateUtils.getDistance(vm.coordinates.lat, vm.coordinates.lon,0, -73.0000) > 10 ){
             $ionicPopup.show({
               template: 'Your lastest park place is more than 10 meters far from here. Are you sure you want to reset your location? ',
               title: 'Distance warning',
               scope: $scope,
               buttons: [
                 { text: 'Cancel' },
                 {
                   text: 'Accept',
                   type: 'button-positive',
                   onTap: function(e) {
                      vm.clearData();
                   }
                 }
               ]
             });
           }else{
            vm.clearData();
          }
         });
      }
    });
  }
});
