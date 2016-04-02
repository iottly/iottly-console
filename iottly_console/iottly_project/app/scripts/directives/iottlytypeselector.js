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