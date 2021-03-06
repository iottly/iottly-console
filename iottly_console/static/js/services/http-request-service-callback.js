/*

Copyright 2015 Stefano Terna

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

'use strict';

function http_callback($http, $q, API_URL) {
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

    var _get = function (wsUrl, id, data) {
        if (id === undefined) {
          return _list(wsUrl);
        }
        var deferred = $q.defer();
        if (wsUrl) {
          var config = (data && {params: data}) || undefined

          $http.get(wsBasePath + wsUrl + '/' + id, config).success(function (data) {
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
        return _post('project', projectObj);
    };

    var _updateProject = function  (id, data) {
        console.log('update project');
        return _update('project', id, data);
    };

    var _deleteProject = function  (id) {
        console.log('delete project');
        return _delete('project', id);
    };

    
    var _listProjects = function () {
        console.log('list projects');
        return _list('project/');
    };

    var _getProject = function (id) {
        console.log('get project');
        return _get('project', id);
    };

    var _deleteBoard = function (id, macaddress) {
        var deferred = $q.defer();
        var wsUrl = 'project';
        $http.delete(wsBasePath + wsUrl + '/' + id + '/deviceregistration/' + macaddress).success(function (data) {
          deferred.resolve(data);
        }).error(function (error) {
          deferred.reject(error);
        });

        return deferred.promise;
    };

    var _pollPresenceForBoard = function (boardid) {
        console.log('poll presence');
        return _get('presence', boardid);
    };

    var _getMessages = function (boardid, numMessages, queryJson) {
        console.log('get messages');
        var data = {
            numMessages: numMessages,
            queryJson: queryJson
        };
        console.log(data);

        return _get('msg', boardid, data);
    };

    var _createMessage = function  (id, message) {
        console.log('create message');
        var deferred = $q.defer();
        var wsUrl = 'project';
        $http.post(wsBasePath + wsUrl + '/' + id + '/messagedefinition', message).success(function (data) {
          deferred.resolve(data);
        }).error(function (error) {
          deferred.reject(error);
        });

        return deferred.promise;        
    };

    var _deleteMessage = function (id, message) {
        var deferred = $q.defer();
        var wsUrl = 'project';
        $http.delete(wsBasePath + wsUrl + '/' + id + '/messagedefinition/' + message.metadata.type).success(function (data) {
          deferred.resolve(data);
        }).error(function (error) {
          deferred.reject(error);
        });

        return deferred.promise;
    };

    var _updateMessage = function  (id, message) {
        console.log('update message');
        var deferred = $q.defer();
        var wsUrl = 'project';
        $http.put(wsBasePath + wsUrl + '/' + id + '/messagedefinition', message).success(function (data) {
          deferred.resolve(data);
        }).error(function (error) {
          deferred.reject(error);
        });

        return deferred.promise;        
    };  

    var _sendCommand = function  (id, deviceid, cmd_type, values) {
        console.log('send command');
        var deferred = $q.defer();
        var wsUrl = wsBasePath + 'project' + '/' + id + '/device'  + '/' + deviceid + '/command';
        var params = {cmd_type: cmd_type, values: values};
        $http.post(wsUrl, params).success(function (data) {
          deferred.resolve(data);
        }).error(function (error) {
          deferred.reject(error);
        });

        return deferred.promise;        
    };

    var _flashfw = function  (id, deviceid) {
        console.log('flash fw');
        var deferred = $q.defer();
        var wsUrl = wsBasePath + 'project' + '/' + id + '/device'  + '/' + deviceid + '/flashfw';
        $http.post(wsUrl).success(function (data) {
          deferred.resolve(data);
        }).error(function (error) {
          deferred.reject(error);
        });

        return deferred.promise;        
    };

    return {    
        "createProject"         : _createProject,
        "updateProject"         : _updateProject,
        "deleteProject"         : _deleteProject,
        "listProjects"          : _listProjects,        
        "getProject"            : _getProject,        
        "deleteBoard"           : _deleteBoard,
        "pollPresenceForBoard"  : _pollPresenceForBoard,
        "getMessages"           : _getMessages,
        "createMessage"         : _createMessage,
        "deleteMessage"         : _deleteMessage,
        "updateMessage"         : _updateMessage,
        "sendCommand"           : _sendCommand,   
        "flashfw"               : _flashfw,
        "list"                  : _list,
        "get"                   : _get,
        "post"                  : _post,
        "create"                : _update,
        "update"                :  _update,
        "remove"                : _delete
    };
}
