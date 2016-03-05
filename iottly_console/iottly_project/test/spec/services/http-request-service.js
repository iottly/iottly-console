'use strict';

describe('Service: httpRequestService', function () {

  // load the service's module
  beforeEach(module('consoleApp'));

  // instantiate service
  var httpRequestService;
  beforeEach(inject(function (_httpRequestService_) {
    httpRequestService = _httpRequestService_;
  }));

  it('should do something', function () {
    expect(!!httpRequestService).toBe(true);
  });

});
