'use strict';

describe('Controller: BoardscontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('consoleApp'));

  var BoardscontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BoardscontrollerCtrl = $controller('BoardscontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BoardscontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
