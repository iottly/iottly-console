'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:DevicecodeCtrl
 * @description
 * # DevicecodeCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('DevicecodeCtrl', function ($scope, $rootScope) {
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
