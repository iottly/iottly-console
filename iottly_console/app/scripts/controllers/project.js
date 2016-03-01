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
 * @ngdoc function
 * @name consoleApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('ProjectCtrl', function (httpRequestService) {
    this.project = {
      'boards':[]
    };
    this.boardalert = '';

    this.createProject = function(panel){
      if (this.checkBoardList()) {
        this.project.fwlanguage = this.fwlanguage();
        this.project.messages = [];
        httpRequestService.createProject(this.project).then(function(data){
          panel.project = this.project;
          panel.setTab(1);
        }, function (error) {
          //TODO error message
          console.error(error);
        });
               
      }       
    };
    this.fwlanguage = function(){
      if (this.project.board === 'Arduino')
        return 'Wiring';
      else if (this.project.board)
        return 'Python';
      else return '';
    };

    this.checkBoard = function(){
      return typeof this.project.board === "undefined" || this.project.board === 'Raspberry Pi';
    };

    this.validateBoard = function(){
      return this.project.board === 'Raspberry Pi';
    };

    this.checkBoardList = function(){
      return this.project.boards.length > 0;
    };
  });
