'use strict';

/**
 * @ngdoc service
 * @name consoleApp.httpRequestService
 * @description
 * # httpRequestService
 * Service in the consoleApp.
 */
angular.module('consoleApp')
  .service('httpRequestService', function ($q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var _createProject = function  (projectObj) {
    	console.log('create project');
    	var deferred = $q.defer();
		var promise = deferred.promise;
		 
		promise.then(function success(data) {
		  console.log('Success!', data);
		}, function error(msg) {
		  console.error('Failure!', msg);
		});
		 
		deferred.reject('We failed :(');

    };
    
	return { createProject : _createProject};
  });
