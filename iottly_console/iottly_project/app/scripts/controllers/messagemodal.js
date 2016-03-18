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

    $scope.project = angular.copy(project);
    $scope.message = angular.copy(message) || {metadata: {direction: 'command'}};

    $scope._properties = Utils.controllerhelpers.getTypeProp($scope.message);


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

        httpRequestService.createMessage($scope.project.data._id.$oid, $scope.message).then(function(data){
          $uibModalInstance.close(data, $scope.message);
        }, function (error) {
          //TODO error message
          console.error(error);
          $uibModalInstance.dismiss(error);
        });        
      } else if ($scope.mode ==='edit') {
        //TODO call to api

      };
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };


    $scope.checkProperties = function(){
      return $scope.properties.length === 0;
    };    

    $scope.getRenderedProperty = function(property) {
      return JSON.stringify(Utils.controllerhelpers.getRenderedProperty(property));
    };

    $scope.removeKey = function(property){
      delete $scope._properties[property];
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
      if ($scope.property.value) {
        var normkey = Utils.controllerhelpers.normalizeProperty($scope.property.key);
        if (!properties.hasOwnProperty(normkey)){
          properties[normkey] = $scope.property.value;
          $scope.property = {};
        };      
      };




    };
  });
