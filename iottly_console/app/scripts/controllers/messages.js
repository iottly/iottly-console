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

