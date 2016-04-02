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
 * @name iottlyMainApp.controller:NewprojectmodalCtrl
 * @description
 * # NewprojectmodalCtrl
 * Controller of the iottlyMainApp
 */
angular.module('iottlyMainApp').controller('NewprojectmodalCtrl', function ($scope, $uibModalInstance, httpRequestService) {

  $scope.project = {
    boards: [],
    messages: []        
  };


  $scope.checkBoard = function(){
      return typeof $scope.project.board === "undefined" || $scope.project.board === 'Raspberry Pi' || $scope.project.board === 'Dev Docker Device';
  };

  $scope.fwlanguage = function(){
    if ($scope.project.board === 'Arduino')
      return 'Wiring';
    else if ($scope.project.board)
      return 'Python';
    else return '';
  };  

  $scope.ok = function () {
    $scope.project.fwlanguage = $scope.fwlanguage();
    $scope.project.messages = [];
    $scope.project.user = {'email': 'test@test.test'};
    httpRequestService.createProject($scope.project).then(function(data){
      $uibModalInstance.close(data);
    }, function (error) {
      //TODO error message
      console.error(error);
      $uibModalInstance.dismiss(error);
    });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});