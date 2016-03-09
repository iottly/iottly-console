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