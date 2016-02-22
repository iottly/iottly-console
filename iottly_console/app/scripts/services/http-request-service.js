'use strict';

/**
 * @ngdoc service
 * @name consoleApp.httpRequestService
 * @description
 * # httpRequestService
 * Service in the consoleApp.
 */
angular.module('consoleApp')
  .service('httpRequestService', function ($http, $q, API_URL) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var wsBasePath = API_URL;
    var _list = function (wsUrl) {
        var deferred = $q.defer();
        if (wsUrl) {
          $http.get(wsBasePath + wsUrl).success(function (data) {
            deferred.resolve(data);
          }).error(function (error) {
            deferred.reject(error);
          });
        } else {
          deferred.reject('Web Service URL is not defined');
        }
        return deferred.promise;
    };

    var _get = function (wsUrl, id) {
        if (id === undefined) {
          return _list(wsUrl);
        }
        var deferred = $q.defer();
        if (wsUrl) {
          $http.get(wsBasePath + wsUrl + '/' + id).success(function (data) {
            try {
              
                deferred.resolve(data);
              
            } catch (error) {
              deferred.reject(error);
            }
          }).error(function (error) {
            deferred.reject(error);
          });
        } else {
          deferred.reject('Web Service URL is not defined');
        }
        return deferred.promise;
    };

    var _post = function (wsUrl, data) {
        var deferred = $q.defer();
        if (wsUrl) {
          $http.post(wsBasePath + wsUrl, data).success(function (data) {
            deferred.resolve(data);
          }).error(function (error) {
            deferred.reject(error);
          });
        } else {
          deferred.reject('Web Service URL is not defined');
        }
        return deferred.promise;
    };

    var _update = function (wsUrl, id, data) {
        var deferred = $q.defer();
        if (wsUrl) {
          $http.put(wsBasePath + wsUrl + '/' + id, data).success(function (data) {
            deferred.resolve(data);
          }).error(function (error) {
            deferred.reject(error);
          });
        } else {
          deferred.reject('Web Service URL is not defined');
        }
        return deferred.promise;
    };

    var _delete = function (wsUrl, id) {
        var deferred = $q.defer();
        if (wsUrl) {
          $http.delete(wsBasePath + wsUrl + '/' + id).success(function (data) {
            deferred.resolve(data);
          }).error(function (error) {
            deferred.reject(error);
          });
        } else {
          deferred.reject('Web Service URL is not defined');
        }
        return deferred.promise;
    };

    var _createProject = function  (projectObj) {
    	console.log('create project');
    	_post('project', projectObj);
    };
    
	return { 	
			"createProject" : _createProject,
			"list": _list,
		    "get": _get,
		    "post": _post,
		    "create": _update,
      		"update":  _update,
      		"remove": _delete
    };
});
