'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:DevicesCtrl
 * @description
 * # DevicesCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('DevicesCtrl', function ($scope, $rootScope, $routeParams, $uibModal, httpRequestService, websocketService, projectService) {
    //$scope.project = projectService.project;
    var self = this;
    //$scope.project = $rootScope.project;

    Utils.controllerhelpers.getProject($scope, $routeParams, projectService);

    self.boardalert = '';


    var myListener = $rootScope.$on('devices', function (event, data) {
      console.log('devices');
      $scope.$apply();
    });

    $scope.$on('$destroy', myListener);

    $scope.validateProject = function(){
      return $scope.project.data._id;
    }

    $scope.checkBoardList = function(){
      return ($scope.project.data.boards && $scope.project.data.boards.length > 0);
    };

    $scope.setSelected = function(board){
        $scope.SelectedBoard = board;
    };

    $scope.editBoard = function (size) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/boardmodal.html',
        controller: 'BoardmodalCtrl',
        size: size,
        resolve: {
          board: function () {
            return $scope.SelectedBoard;
          },
          project: function() {
            return $scope.project;
          }
        }
      });

      modalInstance.result.then(function (updatedproject) {
        $scope.project.data = updatedproject;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };


    $scope.menuOptions = [
        ['Edit ...', function ($itemScope) {
          console.log($itemScope.board);
          $scope.editBoard();
        }],
        null, // Dividier
        ['Remove', function ($itemScope) {
          console.log($itemScope.board);
          projectService.deleteBoard($scope.project, $itemScope.board).then(function (data){
            console.log(data);
          }, function (error){
            console.error(error);
          });
        }]
    ];    


  });
