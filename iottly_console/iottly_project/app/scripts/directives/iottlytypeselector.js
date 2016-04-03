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
 * @ngdoc directive
 * @name consoleApp.directive:iottlytypeselector
 * @description
 * # iottlytypeselector
 */

 //http://plnkr.co/edit/WCoK81dHG9Xe7PhWG9AL?p=preview
 
angular.module('consoleApp')
  .directive('iottlytypeselector', function() {
    return {
      restrict: 'AE',
      templateUrl: 'views/iottlyselector.tpl.html', 
      scope: {
        valuetype : '=valuetype'
      },        
      controller: function($scope){
        
        $scope.valuetypes = ['FixedValue', 'MultipleChoice', 'FreeValue'];
        
        $scope.changetype = function(){
          delete $scope.valuetype.value;
          delete $scope.valuetype.listvalues;
          switch ($scope.valuetype.type){
            case 'FixedValue':
              $scope.valuetype.value = '';
              break;
            case 'MultipleChoice':
              $scope.valuetype.listvalues = [''];
              break;
            case 'FreeValue':
              break;              
            default:
              $scope.valuetype = undefined;
          } 
          
        };
        $scope.addvalue = function() {
          $scope.valuetype.listvalues.push(undefined);
        };
        $scope.removevalue = function(index) {
          $scope.valuetype.listvalues.splice(index,1);
        };
        
      },        
      link: function(scope, elm, attrs, ctrl) {
        console.log(scope.valuetype);
        scope.valuetype = ctrl.valuetype;
      }
    };
  });