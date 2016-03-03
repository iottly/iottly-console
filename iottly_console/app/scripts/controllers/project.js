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
 * @name consoleApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('ProjectCtrl', function ($scope, $rootScope, httpRequestService, websocketService) {
    self = this;
    //$scope.project = $rootScope.project;

    self.boardalert = '';


    var myListener = $rootScope.$on('newmessage', function (event, data) {
      console.log('newmessage');
    });

    $scope.$on('$destroy', myListener);



    self.createProject = function(){
      if (self.checkBoardList()) {
        $rootScope.project.fwlanguage = self.fwlanguage();
        $rootScope.project.messages = [];
        $rootScope.project.user = {'email': 'test@test.test'};

        httpRequestService.createProject($rootScope.project).then(function(data){
          console.log(self);
          $rootScope.project = data;
        }, function (error) {
          //TODO error message
          console.error(error);
        });
               
      }       
    };



    self.fwlanguage = function(){
      if ($rootScope.project.board === 'Arduino')
        return 'Wiring';
      else if ($rootScope.project.board)
        return 'Python';
      else return '';
    };

    self.checkBoard = function(){
      return typeof $rootScope.project.board === "undefined" || $rootScope.project.board === 'Raspberry Pi' || $rootScope.project.board === 'Dev Docker Device';
    };

    self.validateBoard = function(){
      return $rootScope.project.board === 'Raspberry Pi';
    };

    self.validateProject = function(){
      return $rootScope.project._id;
    }

    self.checkBoardList = function(){
      //return $rootScope.project.boards.length > 0;
      return true;
    };
  });
