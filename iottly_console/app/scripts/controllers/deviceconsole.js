'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:DeviceconsoleCtrl
 * @description
 * # DeviceconsoleCtrl
 * Controller of the consoleApp
 */
angular.module('consoleApp')
  .controller('DeviceconsoleCtrl', function ($scope, $rootScope, $timeout) {
    this.selectedboardstr = '{}'
    //this.selectedboard = {};

    this.events = [];


    this.selectedboard = function(){
      return JSON.parse(this.selectedboardstr);
    };

    this.boardisSelected = function(){
      return typeof this.selectedboard().ID !== 'undefined';
    };
    
    this.messagetoJSON = function(message){
      return messagetoJSON(message);
    };    

    this.send = function(command, project){
      var echo = {};
      var body = JSON.parse(messagetoJSON(command));
      delete body.$$hashKey;
      body.ECHO = 1;

      echo.json = JSON.stringify(body, null, 2);
      

      echo.to = 'iottly.org/' + project.name.split(' ').join('_');
      echo.from =  this.selectedboard().name.split(' ').join('_') + '/' + this.selectedboard().ID;
      echo.timestamp = new Date;

      
      $timeout(function(events){ events.push(echo); }, 1000, true, this.events);
      
    };
  });
