'use strict';

/**
 * @ngdoc directive
 * @name consoleApp.directive:iottlystandardcommand
 * @description
 * # iottlystandardcommand
 */
angular.module('consoleApp')
  .directive('iottlystandardcommand', function ($compile) {
    return {
      restrict: 'AE',
      templateUrl: 'views/iottlystandardcommand.tpl.html', 
      scope: {
        command : '=command',
        send: '&'
      },        
      controller: function($scope){
      
        $scope._properties = Utils.controllerhelpers.getTypeProp($scope.command);
    
    
        Object.defineProperty($scope, "properties", {
          get: function () { 
            //filters out non own properties (from prototype)
            return Object.keys($scope._properties);
          }
        });             
        
        $scope.isCollapsed = true;
        $scope.addvalue = function() {
          $scope.valuetype.listvalues.push(undefined);
        };

      },        
      link: function(scope, elm, attrs, ctrl) {
        var prop = '<div ng-include="\'views/properties.tpl.html\'" />'; 
        var el = $compile(prop)(scope);
        elm.after(el);
        elm.addClass("btn btn-default msg-attr");
        attrs.$set('ngClick', 'isCollapsed = !isCollapsed');
        attrs.$set('title', scope.command.metadata.description);
        
        elm.removeAttr("ng-repeat");
        elm.removeAttr("iottlystandardcommand");
        $compile(elm)(scope);
        
      }
    };      
  });
