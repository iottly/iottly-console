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
 * @name iottlyMainApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the iottlyMainApp
 */
angular.module('iottlyMainApp')
  .controller('MainCtrl', function ($scope, $window, $uibModal, $log, httpRequestService) {

    httpRequestService.listProjects().then(function(data){
        $scope.projects = data;
      }, function (error) {
        console.error(error);
      }
    );


    $scope.setSelected = function(projectid){
        $scope.idSelectedProject = projectid;
    };

    $scope.openproject = function(projectid){
        $window.open('http://127.0.0.1:8550/' + 'project' + '/' + projectid.$oid, '_blank');
    };

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/newprojectmodal.html',
        controller: 'NewprojectmodalCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.username;
          }
        }
      });

      modalInstance.result.then(function (newproject) {
        $scope.projects.push(newproject);
        $scope.setSelected(newproject._id);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    $scope.menuOptions = [
        ['Open ...', function ($itemScope) {
          console.log($itemScope.project);
          $scope.openproject($itemScope.project._id)
        }],
        null, // Dividier
        ['Remove', function ($itemScope) {
          console.log($itemScope.project);
          httpRequestService.deleteProject($itemScope.project._id.$oid);
        }]
    ];    


  });
