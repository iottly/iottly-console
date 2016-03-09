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
 * @name consoleApp.controller:DevicecodeCtrl
 * @description
 * # DevicecodeCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('DevicecodeCtrl', function ($scope, $rootScope, projectService) {
    Utils.controllerhelpers.getProject($scope, $routeParams, projectService);

    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    this.loaded = 1;

    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'python',
    };

    this.code = '';

    this.codemirrorLoaded = function(_editor){
      // Editor part
      //var _doc = _editor.getDoc();
      $rootScope.editor = _editor;
      $rootScope.editor.getDoc().setValue($rootScope.projectSourceCode);

      //codeCtrl.code = this.projecttoCode();

      setTimeout(function(){ 
        $rootScope.editor.refresh(); 
      }, 100);
      // _editor.on("change", function(){
      //   _editor.refresh();
      // });
    };
    
  });
