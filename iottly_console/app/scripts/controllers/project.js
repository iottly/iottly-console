'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('ProjectCtrl', function () {
    this.project = {
      'boards':[]
    };
    this.boardalert = '';

    this.createProject = function(panel){
      if (this.checkBoardList()) {
        this.project.fwlanguage = this.fwlanguage();
        this.project.messages = [];

        panel.project = this.project;

        panel.setTab(1);
  
        return true;        
      }
      else
        return false;
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
