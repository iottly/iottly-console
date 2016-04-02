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

        $scope.values = {};

        $scope.isCollapsed = true;
        $scope.addvalue = function() {
          $scope.valuetype.listvalues.push(undefined);
        };

        $scope._send = function() {
          var values = {};
          $scope.properties.forEach(function(prop){
            values[$scope.command.metadata.type + '.' + prop] = $scope.values[prop];
          });
          $scope.send({msg: $scope.command, values: values});
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
