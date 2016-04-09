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
      if ($scope.project.data.fwcode) {
        $scope.initTree();
      };
    };

    //BEGIN CODE MGM
    // $scope.snippets = [];
    // $scope.initSnippets = function(){
    //   $scope.project.data.fwcode.snippets.forEach(function(snippet) {
    //     var _snippet = {
    //       data: snippet,
    //       codecache: snippet.code,
    //       saved: true
    //     };

    //     Object.defineProperty(_snippet, "code", {
    //       get: function () { 
    //         return _snippet.data.code;
    //       },
    //       set: function (value) {
    //         _snippet.data.code = value;
    //         _snippet.saved = (_snippet.data.code === _snippet.codecache);
    //       }
    //     });
    //     $scope.snippets.push(_snippet);
    //   });
    // };


    $scope.editorOptions = {
      lineWrapping : false,
      lineNumbers: true,
      mode: 'python',
    };

    var loadededitorcount = 0;
    $scope.codemirrorLoaded = function(_editor){

      //fix codemirror refresh bug with angular
      $timeout(function() {
        _editor.refresh();
        loadededitorcount++;
      });

      _editor.on("change", function(instance, changeObj){
        var tree_snippet = tree_data_flattened.filter(function(ts){
          //FIXME: don't use global selectedSnippetid, instead inject some annotation inside CodeMirror
          return ts.data.snippetid === $scope.selectedSnippetid;
        })[0];
        if (tree_snippet){
          tree_snippet.data.saved = false;
        };
      });

    };


    Object.defineProperty($scope, "editorsLoaded", {
      get: function () { 
        return tree_data_flattened.length > 0 && 
          tree_data_flattened.length === loadededitorcount;
      }
    });     


    Object.defineProperty($scope, "snippetsSaved", {
      get: function () { 
        return tree_data_flattened.some(function(sn) {
          return !sn.data.saved;
        });
      },
      set: function (saved) {
        tree_data_flattened.forEach(function(sn){
          sn.data.saved = saved;
        });
      }
    });     

    $scope.selectedSnippetid = '';
    $scope.isSnippetSelected = function(snippetid){
      return $scope.selectedSnippetid === snippetid;
    };

    $scope.saveCode = function(){

      var update = {
          filter: undefined,
          document: {"fwcode.snippets": $scope.project.data.fwcode.snippets}
      };


      projectService.updateProject($scope.project, update).then(function(data){
        $scope.snippetsSaved = true;
      }, function (error) {
        //TODO error message
        console.error(error);
      });      
    };

    //END CODE MGM

    //BEGIN TREE MGM
    $scope.tree_ctrl = {};
    $scope.tree_data = [];
    var tree_data_flattened = [];

    $scope.initTree = function() {
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
        var tree_snippet = {
          label: snippet.description,
          data: {
            snippetid: snippet.snippetid,
            saved: true,
            label: snippet.description
          }
        };
        Object.defineProperty(tree_snippet, "label", {
          get: function () { 
            if (tree_snippet.data.saved)
              return tree_snippet.data.label;
            else
              return tree_snippet.data.label + ' *';
          }
        });        
        category.children.push(tree_snippet);
        tree_data_flattened.push(tree_snippet);
      });
      $scope.tree_ctrl.expand_all();
    };

    $scope.tree_handler = function(branch) {
      if (branch.children.length === 0) {
        $scope.selectedSnippetid = branch.data.snippetid;
      } else {
        $scope.selectedSnippetid = '';
      }
    };
    

    //END TREE MGM

  });
