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

    self._project = {};


    self.getProject = function(id){

      var deferred = $q.defer();

      if (!self._project.data || self._project.data._id.$oid !== id) {
        httpRequestService.getProject(id).then(function (data){
          self._project.data = data;
          $rootScope.$emit('project', self._project.data);
          deferred.resolve(self._project.data);
        }, function (error){
          console.error(error);
          $rootScope.$emit('projecterror', error);          
          deferred.reject(error);
        });

      } else {
        $rootScope.$emit('project', self._project.data);
        deferred.resolve(self._project.data);
      }

      return deferred.promise;
    };

    Object.defineProperty(self, "projectdata", 
      { set: function (data) { self._project.data = data; }
    });


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

    self.updateProject = function(project, data){
      var deferred = $q.defer();

      httpRequestService.updateProject(project.data._id.$oid, data).then(function(data){
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
        self._project.data.boards.push(data.registration.board);
      }

    });


  });
