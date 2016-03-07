'use strict';

/**
 * @ngdoc directive
 * @name iottlyMainApp.directive:ngRightClick
 * @description
 * # ngRightClick
 */
angular.module('iottlyMainApp')
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
