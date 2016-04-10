'use strict';

describe('Controller: FlashboardmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('consoleApp'));

  var FlashboardmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FlashboardmodalCtrl = $controller('FlashboardmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FlashboardmodalCtrl.awesomeThings.length).toBe(3);
  });
});
