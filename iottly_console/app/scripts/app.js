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
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/messages', {
        templateUrl: 'views/messages.html',
        controller: 'MessagesCtrl',
        
      })
      .when('/devicecode', {
        templateUrl: 'views/devicecode.html',
        controller: 'DevicecodeCtrl',
        controllerAs: 'codeCtrl'
      })
      .when('/deviceconsole', {
        templateUrl: 'views/deviceconsole.html',
        controller: 'DeviceconsoleCtrl',
        controllerAs: 'deviceCtrl'
      })
      .when('/project', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl',
        controllerAs: 'projectCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular
  .module('consoleApp').controller('AppCtrl', function ($scope, $rootScope, $location, httpRequestService) {
        //this.tab = 0;
    
      
    // this.project = {
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

    this.project = {
      'boards': [],
      'messages': []
    }

    this.commands = [];
    

    this.getSectionFromId = function(secId){
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
    this.setTab = function(value){
      this.tab = value;
      if (this.isSet(3))
        this.setCommands();
      $location.path(this.getSectionFromId(value) )
    };

    this.editCode = function(codeCtrl){
      this.setTab(2);
      $rootScope.projectSourceCode = this.projecttoCode();
      //$rootScope.editor.getDoc().setValue();

      //codeCtrl.code = this.projecttoCode();
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

    this.projecttoCode = function() {
      var code = '#  Kindly written by IOTTLY for you on ' + (new Date).toISOString();
      code = code + '\n';
      code = code + '\n' + '#  Project: ' + this.project.name;
      code = code + '\n' + '#  Board: ' + this.project.board;
      code = code + '\n';

      code = code + '\n' + 'import iottly             #The IOTTLY module';
      code = code + '\n' + 'import RPi.GPIO as GPIO   #The GPIO module'

      code = code + '\n';

      var uniquemsgs = uniqueBy(this.project.messages, function(x){ return x.typetag; });

      uniquemsgs.forEach(function(element, index, array){
        code = code + '\n' + '#  This function will be called every time';
        code = code + '\n' + '#  the board receives the following command: '+ element.type;
        code = code + '\n' + 'def ' +  element.typetag + '(command):';
        code = code + '\n';
        code = code + '\n' + '  ' + '#  command is a dictionary with the following example structure:'
        code = code + '\n' + '  ' + '#    ' + messagetoJSON(element);
        code = code + '\n' + '  ' + 'payload = command["' + element.typetag + '"]';

        code = code + '\n';
  
        code = code + '\n' + '  ' + '#  this event is sent back to IOTTLY'
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

    this.isSet = function(value){
      return this.tab === value;
    };

    this.checkMessages = function(){
      return this.project.messages.length === 0;
    };


    this.setCommands = function() {

      if (this.isSet(3)) {
        this.commands.push(
          {
            'type': 'update firmware',
            'description': 'Over the air firmware update',
            'keys':[
              {
                'key':'new_firmware_available',
                'value': 1
              },
              {
                'key':'firmware_name',
                'value': this.project.name.split(' ').join('_')
              }
            ]
          });

        this.project.messages.forEach(function(element, index, array){
          this.commands.push(element);
        }, this);

      };

    };
    this.setTab(0);

  });