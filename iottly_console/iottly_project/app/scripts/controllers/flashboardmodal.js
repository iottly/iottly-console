'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:FlashboardmodalCtrl
 * @description
 * # FlashboardmodalCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('FlashboardmodalCtrl', function ($rootScope, $scope, $uibModalInstance, httpRequestService, project) {

  $scope.project = angular.copy(project);

  $scope._selectedboard = undefined;


  Object.defineProperty($scope, "selectedboard", {
    get: function () { 
      return $scope._selectedboard;
    },
    set: function (board) { 
      $scope._selectedboard = board;
    },
  });

  $scope.max = 100;
  $scope.dynamic = 0;
  
  var myListener = $rootScope.$on('interface', function (event, data) {
    if (data.type === 'progress') {
      if (data.to === $scope.selectedboard.jid) {
        $scope.dynamic = Math.floor(data.chunks_sent / data.total_chunks * 100);
        if (data.chunks_sent == 0) {
          $scope.progresstext = "Flash starting"  
        } else if (data.chunks_sent == data.total_chunks) {
          $scope.progresstext = "Transfer Complete!";  
          $scope.complete = true;
        } else {
          $scope.progresstext = "Sent "+data.chunks_sent+" chunks of "+data.total_chunks;
        }
        $scope.$apply();
      }
    };
  });
  $scope.$on('$destroy', myListener);


  $scope.flashstarted = false;
  $scope.complete = false;
  $scope.flash = function () {

    httpRequestService.flashfw($scope.project.data._id.$oid, $scope.selectedboard.ID).then(function(data){
      $scope.flashstarted = true;
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
