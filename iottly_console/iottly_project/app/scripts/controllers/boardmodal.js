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
 * @name consoleApp.controller:BoardmodalCtrl
 * @description
 * # BoardmodalCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('BoardmodalCtrl', function ($scope, $uibModalInstance, projectService, board, project) {

  $scope.board = angular.copy(board);
  $scope.project = angular.copy(project);

  $scope.ok = function () {

    var update = {
        filter: {"boards.ID": $scope.board.ID},
        document: {"boards.$.name": $scope.board.name}
    };

    projectService.updateProject($scope.project, update).then(function(data){
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