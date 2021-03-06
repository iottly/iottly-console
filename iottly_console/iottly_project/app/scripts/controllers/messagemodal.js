/*

Copyright 2015 Stefano Terna

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:MessagemodalCtrl
 * @description
 * # MessagemodalCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('MessagemodalCtrl', function ($scope, $uibModalInstance, projectService, message, project) {
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
        $scope.message.metadata.jsonfmt = Utils.controllerhelpers.renderMessage($scope.message);

        projectService.createMessage($scope.project, $scope.message).then(function(data){
          $uibModalInstance.close({updatedproject: data, message: $scope.message});
        }, function (error) {
          //TODO error message
          console.error(error);
          $uibModalInstance.dismiss(error);
        });        
      } else if ($scope.mode ==='edit') {
        $scope.message.metadata.jsonfmt = Utils.controllerhelpers.renderMessage($scope.message);
        projectService.updateMessage($scope.project, $scope.message).then(function(data){
          $uibModalInstance.close({updatedproject: data, message: $scope.message});
        }, function (error) {
          //TODO error message
          console.error(error);
          $uibModalInstance.dismiss(error);
        });        


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
