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
 * @name consoleApp.controller:BoardscontrollerCtrl
 * @description
 * # BoardscontrollerCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('BoardsController', function ($scope) {
    this.board = {};

    this.addBoard = function(boards){
      this.board.ID = Math.random().toString(36).substring(7);
      boards.push(this.board);
      this.board = {};
      $scope.createboard.$setUntouched();
      
    };

    this.checkBoardName = function(){
      return typeof this.board.name !== "undefined" &&  this.board.name !== '';
    };
  });
