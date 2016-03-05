'use strict';

describe('Directive: codeEditor', function () {

  // load the directive's module
  beforeEach(module('consoleApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<code-editor></code-editor>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the codeEditor directive');
  }));
});