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

/**
 * @ngdoc service
 * @name consoleApp.projectService
 * @description
 * # projectService
 * Service in the consoleApp.
 */
var s = angular.module('consoleApp')
  .service('projectService', function ($rootScope, $q, $timeout, httpRequestService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    var _project = {
      data: {
        boards: [],
        messages: []        
      }
    };

    Object.defineProperty(self, "project", 
      { get: function () { return _project; }
    });
    Object.defineProperty(self, "projectdata", 
      { set: function (data) { _project.data = data; }
    });


    // self.project = {
    //   get value() {
    //       return _project;
    //   },
    //   set data(value) {
    //     _project.data = value;
    //   }

    // };




    self.createProject = function(project){
      var deferred = $q.defer();

      httpRequestService.createProject(project.data).then(function(data){
        console.log(self);
        self.projectdata = data;
        deferred.resolve(data);
      }, function (error) {
        console.error(error);
        deferred.reject(data);
      });

      return deferred.promise;
    };

    var myListener = $rootScope.$on('devices', function (event, data) {
      console.log(data);

      if (data.registration.new) {
        self.project.data.boards.push(data.registration.board);
      }

    });


  });

console.log('s');
console.log(s);