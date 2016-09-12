/**
 * Created by Usuario on 09/09/2016.
 */
angular.module('ParkApp').directive('gmap', Gmap);

function Gmap(){
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'templates/map.html',
    scope: {
        lat: '@lat',
        lon: '@lon'
    },
    controller: function($scope){
      $scope.latLng = new google.maps.LatLng($scope.lat, $scope.lon);
      $scope.mapOptions = {
        center: $scope.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.marker = undefined;
      $scope.map = new google.maps.Map(document.getElementById("map"), $scope.mapOptions);

    },
    link: function($scope, elem, attrs) {
      function update(oldValue, newValue){
        if( oldValue !== newValue ){
            var latLng = new google.maps.LatLng($scope.lat, $scope.lon);
            if( typeof $scope.marker !== 'undefined' ){
              $scope.marker.setMap(null);
            }
            $scope.marker = new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              position: latLng
            });
            $scope.marker.setMap($scope.map)
            $scope.map.setCenter(latLng);
        }
      }
      $scope.$watch('lon', update);
      $scope.$watch('lat', update);
    }
  }
}
