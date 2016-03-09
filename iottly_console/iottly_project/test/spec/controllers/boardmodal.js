'use strict';

describe('Controller: BoardmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('consoleApp'));

  var BoardmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BoardmodalCtrl = $controller('BoardmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BoardmodalCtrl.awesomeThings.length).toBe(3);
  });
});
