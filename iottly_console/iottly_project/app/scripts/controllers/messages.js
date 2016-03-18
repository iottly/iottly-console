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
 * @name consoleApp.controller:MessagesCtrl
 * @description
 * # MessagesCtrl
 * Controller of the consoleApp
 */

angular.module('consoleApp')
  .controller('MessagesCtrl', function ($scope, $rootScope, $routeParams, $uibModal, projectService) {
    self = this;

    Utils.controllerhelpers.getProject($scope, $routeParams, projectService);


    
    $scope.newMessage= function() {
      return openMessageModal()
    };

    $scope.editMessage= function() {
      return openMessageModal($scope.SelectedMessage)
    };


    var openMessageModal = function (message) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/messagemodal.html',
        controller: 'MessagemodalCtrl',
        size: 'lg',
        resolve: {
          message: function () {
            return message;
          },
          project: function() {
            return $scope.project;
          }
        }
      });

      modalInstance.result.then(function (message) {
        $scope.setSelected(message);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.setSelected = function(message){
      $scope.SelectedMessage = message;
    };

    $scope.isSelected = function(message){
      return message.metadata.type === $scope.SelectedMessage.metadata.type;
    };


    $scope.menuOptions = [
        ['Edit ...', function ($itemScope) {
          console.log($itemScope.project);
          $scope.editMessage()
        }],
        null, // Dividier
        ['Remove', function ($itemScope) {
          //TODO call to api
          console.log($itemScope.project);
          httpRequestService.deleteProject($itemScope.project._id.$oid).then(function (data){
            $scope.projects.splice($scope.projects.indexOf($itemScope.project), 1);
          }, function (error){
            console.error(error);
          });
        }]
    ];    



    $scope.messagetoJSON = function(message){
      return Utils.controllerhelpers.messagetoJSON(message);
    };

    $scope.renderMessage = function(message){
      return Utils.controllerhelpers.renderMessage(message);
    };

 

    $scope.checkMessages = function(){
      return $scope.project.data.messages && $scope.project.data.messages.length === 0;
    };    

  });


