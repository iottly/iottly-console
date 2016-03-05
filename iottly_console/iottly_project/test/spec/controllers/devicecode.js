'use strict';

describe('Controller: DevicecodeCtrl', function () {

  // load the controller's module
  beforeEach(module('consoleApp'));

  var DevicecodeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevicecodeCtrl = $controller('DevicecodeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevicecodeCtrl.awesomeThings.length).toBe(3);
  });
});
