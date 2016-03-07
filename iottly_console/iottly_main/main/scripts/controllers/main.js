'use strict';

/**
 * @ngdoc function
 * @name iottlyMainApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the iottlyMainApp
 */
angular.module('iottlyMainApp')
  .controller('MainCtrl', function ($scope, $window, httpRequestService) {

    httpRequestService.listProjects().then(function(data){
        $scope.projects = data;
      }, function (error) {
        console.error(error);
      });


    $scope.setSelected = function(projectid){
        $scope.idSelectedProject = projectid;
    }

    $scope.openproject = function(projectid){
        $window.open('http://127.0.0.1:8550/' + 'project' + '/' + projectid.$oid, '_blank');
    }
  });
