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

//  http://plnkr.co/edit/VUkeNvzmOLVYVjKfsCiy?p=preview


angular.module('consoleApp')
  .controller('DeviceconsoleCtrl', function ($scope, $rootScope, $timeout, $routeParams, $location, projectService, httpRequestService) {
    
 
    Utils.controllerhelpers.getProject($scope, $routeParams, projectService);

    var projectListener = $rootScope.$on('project', function (event, data) {
      $scope.init();
    });

    $scope.$on('$destroy', projectListener);

    $scope.$on('$routeChangeSuccess', function(event) {
      $scope.init();
    });

    $scope.init = function(){
      $scope.emptyEvents();
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

      $scope.loadLastMessages();

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

    $scope.filter = {
      numMessages: 10,
      queryJson: undefined 
    }

    $scope.emptyEvents = function(){
      $scope.events = [];     
    };

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

        // #messages-panel > div.panel-body > div
        var msgpanel = $('#messages-panel > div.panel-body > div');
        msgpanel.scrollTop(msgpanel[0].scrollHeight);
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



    $scope.loadLastMessages = function () {
      httpRequestService.getMessages($scope._selectedboard.ID, 
        $scope.filter.numMessages, $scope.filter.queryJson).then(function (data){
        $scope.emptyEvents();
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

    $scope.messagetoJSON = function(message){
      return Utils.controllerhelpers.messagetoJSON(message);
    };

    $scope.initCommands = function() {
      console.log("init commands");
      if ($scope.project.data.name) {
        $scope.commands = [];

        $scope.project.data.messages.forEach(function(element, index, array){
          if (element.metadata.direction === 'command') {
            $scope.commands.push(element);
          };
        }, this);
        
      }

    };

    $scope.send = function(command, values){
      console.log(command);
      console.log(values);

      httpRequestService.sendCommand(
        $scope.project.data._id.$oid, 
        $scope.selectedboard.ID,
        command.metadata.type,
        values
        )
      .then(function (data){
        console.log('command successfull');
      }, function (error){
        console.log(error);
      });
    };

    /*
    * END
    * COMMAND MANAGEMENT
    */


  });

angular.module('consoleApp')
  .filter('propsFilter', function() {
    return function(items, props) {
      var out = [];

      if (angular.isArray(items)) {
        items.forEach(function(item) {
          var itemMatches = false;

          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    }
  });
