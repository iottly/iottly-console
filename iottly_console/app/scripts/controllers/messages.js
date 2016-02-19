'use strict';

/**
 * @ngdoc function
 * @name consoleApp.controller:MessagesCtrl
 * @description
 * # MessagesCtrl
 * Controller of the consoleApp
 */

 var messagetoJSON = function(message){
    var msg = {};

    message.typetag = message.type.split(' ').join('_');
    msg[message.typetag] = {};
    

    message.keys.forEach(function(element, index, array){
      msg[message.typetag][element.key.split(' ').join('_')] = element.value;
    });

    return JSON.stringify(msg);
 };

angular.module('consoleApp')
  .controller('MessagesCtrl', function ($scope) {
    this.message = {};
    this.message.keys = [];

    this.addMessage = function(messages){
      this.message.typetag = this.message.type.split(' ').join('_');
      messages.push(this.message);
      this.message = {};
      this.message.keys = [];
      $scope.createMessageForm.$setUntouched();
    };


    this.messagetoJSON = function(message){
      return messagetoJSON(message);
    };

    this.checkKeys = function(){
      return this.message.keys.length === 0;
    };
  });

angular.module('consoleApp')
  .controller('KeysController', function () {
    console.log('NEW KeysController');
    this.key = {};

    this.addKey = function(keys){
      keys.push(this.key);
      this.key = {};
      
    };
  });

