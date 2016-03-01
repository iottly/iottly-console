'use strict';

/**
 * @ngdoc service
 * @name consoleApp.websocketService
 * @description
 * # websocketService
 * Service in the consoleApp.
 */
angular.module('consoleApp')
  .service('websocketService', function () {
    
    var bigboss = {};

    bigboss.eventManager = (function($, self) {
      var eventListeners = {}
      var conn = null;

      function init() {
        disconnect();
        conn = new SockJS('http://' + window.location.host + '/messageChannel');

        conn.onopen = function() {
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

      self.init = function() {
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
              bigboss.eventManager.init();
            }, delay);
          }
        });
        bigboss.eventManager.addEventListener('onmessage', {
          handleEvent: function(e) {
            console.log("Received", e);
          }
        });
      }

      return self;
    })(window.jQuery, bigboss.eventDispatcher || {})

    var _init = function(){
      bigboss.eventManager.init();
      bigboss.eventDispatcher.init();        
    };

    return {
        init : _init
    }

  });
