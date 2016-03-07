'use strict';

describe('Controller: NewprojectmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('iottlyMainApp'));

  var NewprojectmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewprojectmodalCtrl = $controller('NewprojectmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NewprojectmodalCtrl.awesomeThings.length).toBe(3);
  });
});
