'use strict';

/**
 * @ngdoc directive
 * @name consoleApp.directive:codeEditor
 * @description
 * # codeEditor
 */
angular.module('consoleApp')
  .directive('codeeditor', function () {
    return {
      template: '<div></div>',
      restrict: 'AEC',
      link: function postLink(scope, element, attrs) {
        element.text('this is the codeEditor directive');
      }
    };
  });
