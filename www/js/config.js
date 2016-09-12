angular.module('ParkApp.config', [])
  .constant('DB_CONFIG', {
    name: 'DB',
    tables: [
      {
        name: 'park',
        columns: [
          {name: 'id', type: 'integer primary key'},
          {name: 'latitude', type: 'double'},
          {name: 'longitude', type: 'double'},
          {name: 'park_date', type: 'long'}
        ]
      }
    ]
  });
