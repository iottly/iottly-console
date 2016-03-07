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
