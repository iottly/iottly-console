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

    $scope.$on('$routeChangeSuccess', function(event) {
      $scope.init();
    });

    $scope.init = function(){
      $scope.initTree();
    };

    //BEGIN CODE MGM

    $scope.refresh = true;
    $scope.loaded = 1;

    $scope.editorOptions = {
        lineWrapping : false,
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

    $scope.selectedEditor = '';
    $scope.isEditorSelected = function(description){
      return $scope.selectedEditor === description;
    };

    //END CODE MGM

    //BEGIN TREE MGM
    $scope.tree_ctrl = {};
    $scope.tree_data = [];

    $scope.initTree = function() {
      if ($scope.project.data.fwcode) {
        $scope.project.data.fwcode.snippets.forEach(function(snippet){

          var category = $scope.tree_data.filter(function(section){
            return section.label === ' ' + snippet.category;
          })[0];
          if (category === undefined) {
            category = {
              label: ' ' + snippet.category,
              children: []
            };
            $scope.tree_data.push(category); 
          };
          category.children.push({
            label: snippet.description
          });
        });
        $scope.tree_ctrl.expand_all();

      };
    };

    $scope.tree_handler = function(branch) {
      if (branch.children.length === 0) {
        $scope.selectedEditor = branch.label;
      } else {
        $scope.selectedEditor = '';
      }
    };
    

    //END TREE MGM

  });
