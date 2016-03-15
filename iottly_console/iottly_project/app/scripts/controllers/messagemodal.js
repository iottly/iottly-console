'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:MessagemodalCtrl
 * @description
 * # MessagemodalCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('MessagemodalCtrl', function ($scope, $uibModalInstance, httpRequestService, message, project) {
    $scope.title = ((message) ? 'Edit' : 'Define');
    
    $scope.message = angular.copy(message) || {keys: []};


    $scope.ok = function(){
      $scope.message.typetag = $scope.message.type.split(' ').join('_');
      project.data.messages.push($scope.message);
      $uibModalInstance.close($scope.message);
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.checkKeys = function(){
      return $scope.message.keys.length === 0;
    };    

  });


angular.module('consoleApp')
  .controller('KeysController', function ($scope) {
    console.log('NEW KeysController');
    $scope.key = {};

    $scope.addKey = function(keys){
      
      keys.push($scope.key);
      $scope.key = {};
      
    };
  });
