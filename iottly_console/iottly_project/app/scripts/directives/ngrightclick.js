'use strict';

/**
 * @ngdoc directive
 * @name consoleApp.directive:ngRightClick
 * @description
 * # ngRightClick
 */
angular.module('consoleApp')
  .directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {$event:event});
        });
      });
    };
  });