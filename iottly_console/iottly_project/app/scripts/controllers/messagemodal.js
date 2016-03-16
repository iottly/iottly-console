'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:MessagemodalCtrl
 * @description
 * # MessagemodalCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('MessagemodalCtrl', function ($scope, $uibModalInstance, httpRequestService, message, project) {
    $scope.mode = ((message) ? 'edit' : 'new');

    $scope.message = angular.copy(message) || {metadata: {}};

    $scope._properties = (function(message){
      if (message.metadata.type){
        var normtype = Utils.controllerhelpers.normalizeProperty(message.metadata.type);        
        return message[normtype];
      } else
        return {};
    })($scope.message);


    Object.defineProperty($scope, "properties", {
      get: function () { 
        //filters out non own properties (from prototype)
        return Object.keys($scope._properties);
      }
    });    


    $scope.ok = function(){
      if ($scope.mode === 'new' && checkUnique()) {
        var normtype = Utils.controllerhelpers.normalizeProperty($scope.message.metadata.type);
        $scope.message[normtype] = $scope._properties;

        //TODO call to api
        project.data.messages.push($scope.message);
        $uibModalInstance.close($scope.message);
      } else if (mode ==='edit') {
        //TODO call to api

      };
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };


    $scope.checkProperties = function(){
      return $scope.properties.length === 0;
    };    


    var checkUnique = function(){
      var ret = true;
      var normtype = Utils.controllerhelpers.normalizeProperty($scope.message.metadata.type);
      project.data.messages.forEach(function(message){
        if (message.hasOwnProperty(normtype))
          ret = false;
      });
      return ret;
    };    

  });


angular.module('consoleApp')
  .controller('PropertiesController', function ($scope) {
    console.log('NEW PropertiesController');
    $scope.property = {};

    $scope.addKey = function(properties){
      var normkey = Utils.controllerhelpers.normalizeProperty($scope.property.key);
      if (!properties.hasOwnProperty(normkey)){
        properties[normkey] = $scope.property.value;
        $scope.property = {};
      };      
    };
  });
