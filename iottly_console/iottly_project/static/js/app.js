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

(function() {
  var app = angular.module('iottly', ['ui.codemirror']);

  app.controller('PanelController', function($scope, $rootScope){
    //this.tab = 0;

    this.tab = 0;    
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

    this.setTab = function(value){
      this.tab = value;

      if (this.isSet(3))
        this.setCommands();
    };

    this.editCode = function(codeCtrl){
      this.tab = 2;

      $rootScope.editor.getDoc().setValue(this.projecttoCode());

      //codeCtrl.code = this.projecttoCode();

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

      uniquemsgs = uniqueBy(this.project.messages, function(x){ return x.typetag; });

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


  });

  app.controller('ProjectController', function(){
    this.project = {
      'boards':[]
    };
    this.boardalert = '';

    this.createProject = function(panel){
      if (this.checkBoardList()) {
        this.project.fwlanguage = this.fwlanguage();
        this.project.messages = [];

        panel.project = this.project;

        panel.tab = 1;
  
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

  app.controller('BoardsController', function($scope){
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


  messagetoJSON = function(message){
    var msg = {};

    message.typetag = message.type.split(' ').join('_');
    msg[message.typetag] = {};
    

    message.keys.forEach(function(element, index, array){
      msg[message.typetag][element.key.split(' ').join('_')] = element.value;
    });

    return JSON.stringify(msg);
  };

  app.controller('MessagesController', function($scope){
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

  app.controller('KeysController', function(){
    this.key = {};

    this.addKey = function(keys){
      keys.push(this.key);
      this.key = {};
      
    };
  });  
  
  app.controller('CodeController', ['$scope', '$rootScope', function($scope, $rootScope) {
    this.loaded = 1;

    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'python',
    };

    this.code = '';

    this.codemirrorLoaded = function(_editor){
      // Editor part
      //var _doc = _editor.getDoc();
      $rootScope.editor = _editor;

      // _editor.on("change", function(){
      //   _editor.refresh();
      // });
    };

    

  }]);

  app.controller('DeviceConsoleController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    
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

  }]);


})();

