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
 * @ngdoc service
 * @name consoleApp.websocketService
 * @description
 * # websocketService
 * Service in the consoleApp.
 */
angular.module('consoleApp')
  .service('websocketService', function ($rootScope, WS_URL) {
    
    var bigboss = {};

    bigboss.eventManager = (function($, self) {

      var wsBasePath = WS_URL;
      var eventListeners = {}
      var conn = null;

      function init(projectid) {
        disconnect();
        conn = new SockJS(wsBasePath + 'messageChannel');

        conn.onopen = function() {
          conn.send(JSON.stringify({'projectid': projectid}));
          fireEvent('onopen');
        };

        conn.onmessage = function(e) {
          fireEvent('onmessage', JSON.parse(e.data));
        };

        conn.onclose = function() {
          fireEvent('onclose');
          conn = null;
        };

      }

      function fireEvent(eventName, e) {
        var listeners = eventListeners[eventName] || [];
        listeners.forEach(function(l) {
          l.handleEvent(e);
        });
      }

      function disconnect() {
        if (conn != null) {
          conn.close();
          conn = null;
        }
      }

      self.addEventListener = function(eventName, listener) {
        eventListeners[eventName] = eventListeners[eventName] || [];
        eventListeners[eventName].push(listener);
      };

      self.init = init;

      return self;
    })(window.jQuery, bigboss.eventManager || {})

    bigboss.eventDispatcher = (function($, self) {
      var self = {};
      var reconnectAttempts = 0;

      self.init = function(projectid) {
        bigboss.eventManager.addEventListener('onopen', {
          handleEvent: function() {
            console.log("Connected");
            reconnectAttempts = 0;
          }
        });
        bigboss.eventManager.addEventListener('onclose', { 
          handleEvent: function() {
            console.log("Disconnected");
            reconnectAttempts += 1;
            var delay = 1000 * (reconnectAttempts + Math.random() - 0.5);
            console.log("Reconnect in " + delay + "ms");
            setTimeout(function() {
              console.log("Attempting reconnect...");
              bigboss.eventManager.init(projectid);
            }, delay);
          }
        });
        bigboss.eventManager.addEventListener('onmessage', {
          handleEvent: function(e) {
            console.log("Received", e);
            if (e.events) {
              $rootScope.$emit('events', e.events);
            }
            else if (e.devices) {
              $rootScope.$emit('devices', e.devices); 
            }
            else if (e.interface) {
              $rootScope.$emit('interface', e.interface);  
            }
          }
        });
      }

      return self;
    })(window.jQuery, bigboss.eventDispatcher || {})

    var _init = function(projectid){
      bigboss.eventManager.init(projectid);
      bigboss.eventDispatcher.init(projectid);        
    };

    return {
        init : _init
    }

  });
