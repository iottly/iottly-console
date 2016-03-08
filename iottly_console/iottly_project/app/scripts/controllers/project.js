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
  .controller('ProjectCtrl', function ($scope, $rootScope, $routeParams, httpRequestService, websocketService, projectService) {
    //$scope.project = projectService.project;
    var self = this;
    //$scope.project = $rootScope.project;

    $scope.project = {
      data: {
      }
    };

    console.log($routeParams.id);
    projectService.getProject($routeParams.id).then(function(data){
      $scope.project.data = data.data;
      $scope.$parent.project.data = data.data;

    }, function(error) {
      console.error(error);
    });

    self.boardalert = '';


    var myListener = $rootScope.$on('devices', function (event, data) {
      console.log('devices');
      $scope.$apply();
    });

    $scope.$on('$destroy', myListener);



    self.createProject = function(){
      if (self.checkBoardList()) {
        $scope.project.data.fwlanguage = self.fwlanguage();
        $scope.project.data.messages = [];
        $scope.project.data.user = {'email': 'test@test.test'};
        projectService.createProject($scope.project).then(function(data){
          console.log(self);
        }, function (error) {
          //TODO error message
          console.error(error);
        });
               
      }       
    };



    self.fwlanguage = function(){
      if ($scope.project.data.board === 'Arduino')
        return 'Wiring';
      else if ($scope.project.data.board)
        return 'Python';
      else return '';
    };

    self.checkBoard = function(){
      return typeof $scope.project.data.board === "undefined" || $scope.project.data.board === 'Raspberry Pi' || $scope.project.data.board === 'Dev Docker Device';
    };

    self.validateBoard = function(){
      return $scope.project.data.board === 'Raspberry Pi';
    };

    self.validateProject = function(){
      return $scope.project.data._id;
    }

    self.checkBoardList = function(){
      //return $scope.project.data.boards.length > 0;
      return true;
    };
  });
