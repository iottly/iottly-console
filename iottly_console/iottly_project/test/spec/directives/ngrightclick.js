'use strict';

describe('Directive: ngRightClick', function () {

  // load the directive's module
  beforeEach(module('consoleApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-right-click></ng-right-click>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngRightClick directive');
  }));
});
