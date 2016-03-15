'use strict';

describe('Controller: MessagemodalCtrl', function () {

  // load the controller's module
  beforeEach(module('consoleApp'));

  var MessagemodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MessagemodalCtrl = $controller('MessagemodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MessagemodalCtrl.awesomeThings.length).toBe(3);
  });
});
