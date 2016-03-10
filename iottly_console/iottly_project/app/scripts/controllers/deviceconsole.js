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
  .controller('DeviceconsoleCtrl', function ($scope, $rootScope, $timeout, $routeParams, $location, projectService, httpRequestService) {
    
    $scope.events = [];

    Utils.controllerhelpers.getProject($scope, $routeParams, projectService);

    var projectListener = $rootScope.$on('project', function (event, data) {
      $scope.init();
    });
    $scope.$on('$destroy', projectListener);

    $scope.$on('$routeChangeSuccess', function(event) {
      $scope.init();
    });

    $scope.init = function(){
      $scope.initSelectedBoard();
      $scope.initCommands();
    };


    /*
    * BEGIN
    * BOARD SELECTION MANAGEMENT
    */
    $scope._selectedboard = undefined;

    $scope.initSelectedBoard = function(){
      if ($routeParams.boardid && $scope.project.data.boards) {

        $scope._selectedboard = $scope.project.data.boards.find(function(board){
          return board.ID === $routeParams.boardid;
        });
        $scope.selectBoard();
      };
    };

    Object.defineProperty($scope, "selectedboard", {
      get: function () { 
        return $scope._selectedboard;
      },
      set: function (board) { 
        var pathparts = $location.path().split("/");

        //change in location will trigger routeChangeSuccess and in turn call selectBoard()
        $location.path('/' + pathparts[1] + '/' + pathparts[2] + '/' + board.ID);
      },
    });

    $scope.selectBoard = function() {
      var jid = $scope._selectedboard.jid;

      // Adjust for JID inconsistency
      if (jid && jid.substring(jid.length - 3) != "/WI" && jid.substring(0,2) == "wi") {
        jid += '/WI';
      } else if (jid && jid.substring(jid.length - 3) != "/IB") {
        jid += '/IB';
      }

      $scope.pollPresenceForBoard();

      $scope.loadLastMessages(jid, 6);

    }

    $scope.boardisSelected = function(){
      return $scope.selectedboard;
    };
    
    /*
    * END
    * BOARD SELECTION MANAGEMENT
    */




    /*
    * BEGIN
    * MESSAGE MANAGEMENT
    */

    $scope.messagetoJSON = function(message){
      return messagetoJSON(message);
    };    

    var myListener = $rootScope.$on('events', function (event, data) {
      console.log('events');
      data.msgs.forEach(function(item){
        if ($scope.boardisSelected() && item.from.indexOf($scope.selectedboard.jid) > -1) {
          $scope.appendMessage(item);
        }
        $scope.$apply();
      });      
    });
    $scope.$on('$destroy', myListener);

    $scope.appendMessage = function(message) {
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
      
      //$msgContainer.scrollTop($msgContainer[0].scrollHeight);
    };


    $scope.loadLastMessages = function (jid, numMessages) {
      httpRequestService.getMessages($scope._selectedboard.ID, numMessages).then(function (data){
        $scope.events = [];
        data.messages.forEach(function(item){
          $scope.appendMessage(item);   
        });
      }, function (error){
        console.log(error);
      });
    }

    /*
    * END
    * MESSAGE MANAGEMENT
    */


    /*
    * BEGIN
    * PRESENCE MANAGEMENT
    */

    $scope.pollPresenceForBoard = function() {
      httpRequestService.pollPresenceForBoard($scope._selectedboard.ID).then(function (data){
          $scope._selectedboard.present = data.present;
      }, function (error){
        console.log(error);
      });
    }

    /*
    * END
    * PRESENCE MANAGEMENT
    */



    /*
    * BEGIN
    * COMMAND MANAGEMENT
    */

    $scope.initCommands = function() {
      console.log("init commands");
      if ($scope.project.data.name) {
        $scope.commands = [
          {
            'type': 'update firmware',
            'description': 'Over the air firmware update',
            'keys':[
              {
                'key':'new_firmware_available',
                'value': 1
              },
              {
                'key':'firmware_name',
                'value': $scope.project.data.name.split(' ').join('_')
              }
            ]
          }    
        ];

        $scope.project.data.messages.forEach(function(element, index, array){
          $scope.commands.push(element);
        }, this);
        
      }

    };

    $scope.send = function(command, project){
      var echo = {};
      var body = JSON.parse(messagetoJSON(command));
      delete body.$$hashKey;
      body.ECHO = 1;

      echo.json = JSON.stringify(body, null, 2);
      

      echo.to = 'iottly.org/' + project.data.name.split(' ').join('_');
      echo.from =  $scope.selectedboard.name.split(' ').join('_') + '/' + $scope.selectedboard.ID;
      echo.timestamp = new Date;

      
      $timeout(function(events){ events.push(echo); }, 1000, true, $scope.events);
      
    };

    /*
    * END
    * COMMAND MANAGEMENT
    */


  });
