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
 * @name consoleApp.controller:DeviceconsoleCtrl
 * @description
 * # DeviceconsoleCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('DeviceconsoleCtrl', function ($scope, $rootScope, $timeout, projectService) {
    
    $scope.project = projectService.project;
    
    this.selectedboardstr = '{}'
    //this.selectedboard = {};

    this.events = [];


    this.selectedboard = function(){
      return JSON.parse(this.selectedboardstr);
    };

    this.boardisSelected = function(){
      return typeof this.selectedboard().ID !== 'undefined';
    };
    
    this.messagetoJSON = function(message){
      return messagetoJSON(message);
    };    

    this.send = function(command, project){
      var echo = {};
      var body = JSON.parse(messagetoJSON(command));
      delete body.$$hashKey;
      body.ECHO = 1;

      echo.json = JSON.stringify(body, null, 2);
      

      echo.to = 'iottly.org/' + project.data.name.split(' ').join('_');
      echo.from =  this.selectedboard().name.split(' ').join('_') + '/' + this.selectedboard().ID;
      echo.timestamp = new Date;

      
      $timeout(function(events){ events.push(echo); }, 1000, true, this.events);
      
    };
  });
