'use strict';

describe('Controller: DeviceconsoleCtrl', function () {

  // load the controller's module
  beforeEach(module('consoleApp'));

  var DeviceconsoleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeviceconsoleCtrl = $controller('DeviceconsoleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DeviceconsoleCtrl.awesomeThings.length).toBe(3);
  });
});
