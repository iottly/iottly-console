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
  .controller('DevicecodeCtrl', function ($scope, $routeParams, projectService) {
    Utils.controllerhelpers.getProject($scope, $routeParams, projectService);

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    $scope.loaded = 1;

    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'python',
    };

    $scope.code = '';

    $scope.codemirrorLoaded = function(_editor){
      _editor.getDoc().setValue('ciao');
      _editor.refresh(); 

    };
    
  });
