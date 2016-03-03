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
    var self = this;

    $scope.project = projectService.project;
    
    self.selectedboardstr = '{}'
    //self.selectedboard = {};

    $scope.events = [];


    self.selectedboard = function(){
      return JSON.parse(self.selectedboardstr);
    };

    self.boardisSelected = function(){
      return typeof self.selectedboard().ID !== 'undefined';
    };
    
    self.messagetoJSON = function(message){
      return messagetoJSON(message);
    };    

    var myListener = $rootScope.$on('events', function (event, data) {
      console.log('events');
      data.msgs.forEach(function(item){
        self.appendMessage(item);
      });      
    });


    self.appendMessage = function(message) {
      var el = null;

      function toDateString(dateInMs) {
        if (!dateInMs) {
          return "0000-00-00T00:00:00";
        }
        return new Date(dateInMs).toLocalISOString().split(/[\.\+]/)[0];
      }

      function toJSONReplacer(k, v) {
        if ($.inArray(k, ['to', 'from', 'timestamp', '_id', '$$hashKey']) > -1) {
          return undefined;
        } else if ($.inArray(k, ['time', 'start', 'stop']) > -1) {
          return toDateString(v['$date']);
        } else
          return v;
      }

      message.json = function () {
        return JSON.stringify(this, toJSONReplacer, 2);
      }
      message['timestamp'] = toDateString(message.timestamp.$date);
      
      $scope.events.push(message);  
      $scope.$apply();
      //$msgContainer.scrollTop($msgContainer[0].scrollHeight);
    }


    self.send = function(command, project){
      var echo = {};
      var body = JSON.parse(messagetoJSON(command));
      delete body.$$hashKey;
      body.ECHO = 1;

      echo.json = JSON.stringify(body, null, 2);
      

      echo.to = 'iottly.org/' + project.data.name.split(' ').join('_');
      echo.from =  self.selectedboard().name.split(' ').join('_') + '/' + self.selectedboard().ID;
      echo.timestamp = new Date;

      
      $timeout(function(events){ events.push(echo); }, 1000, true, self.events);
      
    };
  });
