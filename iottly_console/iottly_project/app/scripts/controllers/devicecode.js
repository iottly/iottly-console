/*

Copyright 2015 Stefano Terna

Licensed under the Apache License, Version 2.0 (the "License");
you may not use $scope file except in compliance with the License.
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
 * @name consoleApp.controller:DevicecodeCtrl
 * @description
 * # DevicecodeCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('DevicecodeCtrl', function ($scope, $rootScope, $timeout, $routeParams, projectService) {
    Utils.controllerhelpers.getProject($scope, $routeParams, projectService);

    var projectListener = $rootScope.$on('project', function (event, data) {
      $scope.init();
    });


    $scope.init = function(){
      $scope.initTree();
    };

    //BEGIN CODE MGM

    $scope.refresh = true;
    $scope.loaded = 1;

    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'python',
    };

    $scope.code = 'pass';


    $scope.codemirrorLoaded = function(_editor){

      //fix codemirror refresh bug with angular
      $timeout(function() {
        _editor.refresh();
      });

    };

    //END CODE MGM

    //BEGIN TREE MGM
    var commands_children =[];
    $scope.code_data = [
      {
        label: 'Init secions',
        children: [
          {
            label: 'Import and globals',
            data: {

            }
          },
          {
            label: 'Init function'
          }
        ]
      },
      {
        label: 'Loop sections',
        children: [
          {
            label: 'Loop function'
          }
        ]
      },
      {
        label: 'Command Handlers',
        children: commands_children
      }
    ];

    $scope.initTree = function() {
      $scope.project.data.messages.forEach(function(message){
        if (message.metadata.direction == 'command') {
          commands_children.push(
            {
              label: message.metadata.type,
              data: {command: message}
            }
          );
        }
      });
    };

    $scope.tree_handler = function(branch) {
      var _ref;
      $scope.selectedCodeArea = branch.data;
    };
    

    //END TREE MGM

  });
