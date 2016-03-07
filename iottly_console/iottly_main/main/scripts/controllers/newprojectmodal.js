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