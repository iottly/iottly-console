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
    $scope.mode = ((message) ? 'edit' : 'new');

    $scope.message = angular.copy(message) || {keys: []};

    var gettypeTag = function(type) {
      return type.split(' ').join('_')
        .split(',').join('')
        .split('.').join('');
    };

    $scope.ok = function(){
      $scope.message.typetag = gettypeTag($scope.message.type);
      if (mode === 'new' && checkUnique() || mode === 'edit') {
        //TODO call to api
        project.data.messages.push($scope.message);
        $uibModalInstance.close($scope.message);
      }
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };


    $scope.checkKeys = function(){
      return $scope.message.keys.length === 0;
    };    


    var checkUnique = function(){
      var ret = true;
      project.data.messages.forEach(function(message){
        if (message.typetag === gettypeTag($scope.message.type))
          ret = false;
      });
      return ret;
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
