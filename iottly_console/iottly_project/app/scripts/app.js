/*

Copyright 2015 Stefano Terna

Licensed under the Apache License, Version 2.0 (the "License");
you may not use self file except in compliance with the License.
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
 * @ngdoc overview
 * @name consoleApp
 * @description
 * # consoleApp
 *
 * Main module of the application.
 */
angular
  .module('consoleApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.codemirror',
    'angularSpinner'
  ]).value('API_URL', 'http://127.0.0.1:8550/v1.0/') // api
  .value('WS_URL', 'http://127.0.0.1:8560/v1.0/')    // web socket
  .config(function ($routeProvider) {
    $routeProvider
      .when('/messages/:id', {
        templateUrl: 'views/messages.html',
        controller: 'MessagesCtrl',
        controllerAs: 'messagesCtrl'        
      })
      .when('/devicecode/:id', {
        templateUrl: 'views/devicecode.html',
        controller: 'DevicecodeCtrl',
        controllerAs: 'codeCtrl'
      })
      .when('/deviceconsole/:id', {
        templateUrl: 'views/deviceconsole.html',
        controller: 'DeviceconsoleCtrl',
        controllerAs: 'deviceCtrl'
      })
      .when('/project/:id', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl',
        controllerAs: 'projectCtrl'
      })
      .when('/:id', {
        redirectTo: '/project/:id'
      })
      .otherwise({
        redirectTo: '/project/:id'
      });
  });

angular
  .module('consoleApp').controller('AppCtrl', function ($scope, $rootScope, $location, $routeParams, httpRequestService, websocketService, projectService) {

    self = this;
    
    websocketService.init(); 

 
    $scope.project = {
      data: {
      }
    };


    var projectListener = $rootScope.$on('project', function (event, data) {
      $scope.project.data = data;
    });
    $scope.$on('$destroy', projectListener);
    
    var projecterrorListener = $rootScope.$on('projecterror', function (event, data) {
      window.location = "/project/404.html";
    });
    $scope.$on('$destroy', projecterrorListener);


    self.validateProject = function(){
      return $scope.project.data._id;
    }

    // $rootScope.project = {
    //   'name': 'LEGO motor remote control', 
    //   'board':'Raspberry PI', 
    //   'fwlanguage':'Python',
    //   'boards': [
    //     {
    //       'name':'My Board 1',
    //       'ID': 'jn9wn6x0f6r'
    //     },
    //     {
    //       'name':'My Board 2',
    //       'ID': 't57wh281tt9'
    //     }        
    //   ],
    //   'messages': [
    //     {
    //       'type': 'operate motor',
    //       'description': 'operates the motor clockwise',
    //       'keys':[
    //         {
    //           'key':'motor_number',
    //           'value': 1
    //         },
    //         {
    //           'key':'direction',
    //           'value': 'right'
    //         }
    //       ]
    //     },
    //     {
    //       'type': 'operate motor',
    //       'description': 'operates the motor counter clockwise',
    //       'keys':[
    //         {
    //           'key':'motor_number',
    //           'value': 1
    //         },
    //         {
    //           'key':'direction',
    //           'value': 'left'
    //         }
    //       ]
    //     }
    //   ]
    // }


    self.getSectionFromId = function(secId){
      switch(secId){
        case 0:
          return 'project';
        case 1: 
          return 'messages';
        case 2: 
          return 'devicecode';
        case 3: 
          return 'deviceconsole';
      }
    };
    self.setTab = function(value){
      return function(id) {
        self.tab = value;
        $location.path(self.getSectionFromId(value) + '/' + id );
      }($scope.project.data._id.$oid);
    };

    self.editCode = function(codeCtrl){
      self.setTab(2);
      $rootScope.projectSourceCode = self.projecttoCode();
      //$rootScope.editor.getDoc().setValue();

      //codeCtrl.code = self.projecttoCode();
      //TODO inserire il timeout nel controller
      setTimeout(function(){ 
        $rootScope.editor.refresh(); 
      }, 100);
      
    }


    function uniqueBy(arr, fn) {
      var unique = {};
      var distinct = [];
      arr.forEach(function (x) {
        var key = fn(x);
        if (!unique[key]) {
          distinct.push(x);
          unique[key] = true;
        }
      });
      return distinct;
    }

    self.projecttoCode = function() {
      var code = '#  Kindly written by IOTTLY for you on ' + (new Date).toISOString();
      code = code + '\n';
      code = code + '\n' + '#  Project: ' + $scope.project.data.name;
      code = code + '\n' + '#  Board: ' + $scope.project.data.board;
      code = code + '\n';

      code = code + '\n' + 'import iottly             #The IOTTLY module';
      code = code + '\n' + 'import RPi.GPIO as GPIO   #The GPIO module'

      code = code + '\n';

      var uniquemsgs = uniqueBy($scope.project.data.messages, function(x){ return x.typetag; });

      uniquemsgs.forEach(function(element, index, array){
        code = code + '\n' + '#  self function will be called every time';
        code = code + '\n' + '#  the board receives the following command: '+ element.type;
        code = code + '\n' + 'def ' +  element.typetag + '(command):';
        code = code + '\n';
        code = code + '\n' + '  ' + '#  command is a dictionary with the following example structure:'
        code = code + '\n' + '  ' + '#    ' + messagetoJSON(element);
        code = code + '\n' + '  ' + 'payload = command["' + element.typetag + '"]';

        code = code + '\n';
  
        code = code + '\n' + '  ' + '#  self event is sent back to IOTTLY'
        code = code + '\n' + '  ' + '#  if you see it on Device Admin Console, all is going right with communication!'
        var echo = JSON.parse(messagetoJSON(element));
        echo.ECHO = 1;
        code = code + '\n' + '  ' + '#    ' + JSON.stringify(echo);

        code = code + '\n' + '  ' + 'iottly.sendECHOevent(command)';

        code = code + '\n';
        code = code + '\n' + '  ' + '#  Now it is time to write your useful functions, here:';
        code = code + '\n' + '  ' + '#  for example:';
        code = code + '\n' + '  ' + '#  GPIO.output(<set here desired GPIO>,False)';




        code = code + '\n';

      });


      return code;
    };

    self.isSet = function(value){
      return self.tab === value;
    };

    self.checkMessages = function(){
      return $scope.project.data.messages.length === 0;
    };

    //self.setTab(0);
  }); 