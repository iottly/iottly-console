'use strict';

describe('Service: websocketService', function () {

  // load the service's module
  beforeEach(module('consoleApp'));

  // instantiate service
  var websocketService;
  beforeEach(inject(function (_websocketService_) {
    websocketService = _websocketService_;
  }));

  it('should do something', function () {
    expect(!!websocketService).toBe(true);
  });

});
