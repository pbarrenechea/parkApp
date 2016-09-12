angular.module('ParkApp.services', [])
  .factory('DB', function($q, DB_CONFIG) {
  var self = this;
  self.db = null;

  self.init = function() {
    // Use self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); in production
    self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);

    angular.forEach(DB_CONFIG.tables, function(table) {
      var columns = [];
      angular.forEach(table.columns, function(column) {
        columns.push(column.name + ' ' + column.type);
      });
      var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
      self.query(query);
      console.log('Table ' + table.name + ' initialized');
    });
  };

  self.query = function(query, bindings) {
    bindings = typeof bindings !== 'undefined' ? bindings : [];
    var deferred = $q.defer();

    self.db.transaction(function(transaction) {
      transaction.executeSql(query, bindings, function(transaction, result) {
        deferred.resolve(result);
      }, function(transaction, error) {
        deferred.reject(error);
      });
    });

    return deferred.promise;
  };

  self.fetchAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }

    return output;
  };

  self.fetch = function(result) {
    return result.rows.item(0);
  };

  return self;
})
// Resource service example
  .factory('Park', function(DB) {
    var self = this;

    self.all = function() {
      return DB.query('SELECT * FROM park')
        .then(function(result){
          return DB.fetchAll(result);
        });
    };

    self.getFirst = function() {
      return DB.query('SELECT * FROM park')
        .then(function(result){
          if(result.rows.length > 0){
            return DB.fetch(result);
          }else{
            return undefined;
          }
        });
    };

    self.clear = function(){
      return DB.query("DELETE from park").then(function(){
        console.log("Park cleared");
      });
    };

    self.create = function(latitude, longitude){
      var currentDate = new Date();
      var query = "INSERT INTO park (latitude, longitude, park_date) VALUES (?,?,?)";
      return DB.query(query, [latitude, longitude, currentDate]).then(function(res){
        console.log("Succesfully inserted");
      }, function(err){
        console.error(err);
      });
    };

    return self;
  })
  .factory('CoordinateUtils', function(){

    function getDistance(lat1, lon1, lat2, lon2){
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c * 1000; // Distance in meters
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    return {
      getDistance: getDistance
    };
  });
