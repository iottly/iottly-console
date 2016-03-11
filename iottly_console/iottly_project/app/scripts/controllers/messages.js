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
 * @name consoleApp.controller:MessagesCtrl
 * @description
 * # MessagesCtrl
 * Controller of the consoleApp
 */

angular.module('consoleApp')
  .controller('MessagesCtrl', function ($scope, $rootScope, $routeParams, projectService) {
    Utils.controllerhelpers.getProject($scope, $routeParams, projectService);


    $scope.message = {};
    $scope.message.keys = [];


    $scope.addMessage = function(messages){
      $scope.message.typetag = $scope.message.type.split(' ').join('_');
      messages.push($scope.message);
      $scope.message = {};
      $scope.message.keys = [];
      $scope.createMessageForm.$setUntouched();
    };


    $scope.messagetoJSON = function(message){
      return Utils.controllerhelpers.messagetoJSON(message);
    };

    $scope.checkKeys = function(){
      return $scope.message.keys.length === 0;
    };

    $scope.checkMessages = function(){
      return $scope.project.data.messages && $scope.project.data.messages.length === 0;
    };    

  });

angular.module('consoleApp')
  .controller('KeysController', function ($scope) {
    console.log('NEW KeysController');
    $scope.key = {};

    $scope.addKey = function(keys){
      keys.push($scope.key);
      $scope.key = {};
      
    };
  });

