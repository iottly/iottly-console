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
