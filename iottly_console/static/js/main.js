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

var bigboss = (function($, self){
  var $msgContainer = $('.messages-container')
  var activeBoard;

  function Board(jid, mac, number) {
    this.jid = jid;
    this.macaddress = mac;
    this.simnumber = number == "None" ? undefined : number;
  }

  function BoardList() {
    this.boards = [];
    this.boardsByJid = {};
    this.boardsByMacaddress = {};

    this.add = function(board) {
      this.boards.push(board);
      this.boardsByJid[board.jid] = board;
      if (board.macaddress) {
        this.boardsByMacaddress[board.macaddress] = board;
      }
    }

    this.getBoardByJid = function(jid) {
      return this.boardsByJid[jid];
    }

    this.getBoardByMacaddress = function(macaddress) {
      return this.boardsByMacaddress[macaddress];
    }
  }

  var boardList = new BoardList();

  function init() {
    bindEventListeners()

    $('#ib-board-chooser option').each(function() {
      var b = $(this).data();
      if (b.jid) {
        boardList.add(new Board(b.jid, b.macaddress, b.simnumber));
      }
    });

    if (window.localStorage) {
      var activeIB = window.localStorage['tomorrowdata.activeIB'];
      if (activeIB) {
        $('#ib-board-chooser').select2('val', activeIB).trigger('change');
      }
    }
  }

  function selectBoard(board) {
    var jid = board.jid;

    // Adjust for JID inconsistency
    if (jid && jid.substring(jid.length - 3) != "/WI" && jid.substring(0,2) == "wi") {
      jid += '/WI';
    } else if (jid && jid.substring(jid.length - 3) != "/IB") {
      jid += '/IB';
    }

    $('.commands-panel').show();
    $('input[type="text"]').val('');
    $('.collapse-toggle:not(.collapsed)').click();

    activeBoard = board;
    pollPresenceForBoard(activeBoard);
    loadLastMessages(jid, 6);
    if (window.localStorage) {
      window.localStorage['tomorrowdata.activeIB'] = board.macaddress;
    }
  }

  function appendMessage(message) {
    var el = null;

    function toDateString(dateInMs) {
      if (!dateInMs) {
        return "0000-00-00T00:00:00";
      }
      return new Date(dateInMs).toLocalISOString().split(/[\.\+]/)[0];
    }

    function toJSONReplacer(k, v) {
      if ($.inArray(k, ['to', 'from', 'timestamp', '_id']) > -1) {
        return undefined;
      } else if ($.inArray(k, ['time', 'start', 'stop']) > -1) {
        return toDateString(v['$date']);
      } else
        return v;
    }

    message.json = function () {
      return JSON.stringify(this, toJSONReplacer, 2);
    }
    message['timestamp'] = toDateString(message.timestamp.$date);
    el = ich.message(message);
    $msgContainer.append(el);
    $msgContainer.scrollTop($msgContainer[0].scrollHeight);
  }

  function format(state) {
      var template = [
      '<span class="ib-option">'+state.text+'</span>'
      ].join('\n');
      return template;
  }

  function pollPresenceForBoard(board) {
    $.get('/presence', {
        jid: board.jid
      }, function(data, success, jqXhr) {
        setPresence(data.present);
      });
  }

  function loadLastMessages(jid, numMessages) {
    $.get('/msg', {
        jid: jid,
        numMessages: numMessages
      }, function(data, success, jqXhr) {
        $msgContainer.empty();
        if (data.status == 200) {
          data.messages.forEach(function(msg) {
            appendMessage(msg);
          })
        }
      });
  }

  function setPresence(online) {
    var led = $('.commands-panel .led');
    led.removeClass('led-green led-red')
    var ledClass = online ? 'led-green' : 'led-red';
    led.addClass(ledClass);
  }

  function confirmCommandSend($el, commandName) {
    if ($el.hasClass('cmd-warn')) {
      if (!window.confirm("Send the command '"+commandName+"'?")) {
        $el.blur();
        return false;
      }
    }
    return true;
  }

  function bindEventListeners() {
    $('button.command').on('click', function(e) {
      var commandName = $(this).data('command');
      var toJID = activeBoard.jid;
      var formData = $(this).parents('form').serializeObject();

      if (confirmCommandSend($(this), commandName)) {
        $.post('/command', {
          cmd: commandName,
          jid: toJID,
          values: formData
        }).done(function(resp) {
          if (resp.status != 200){
            alert(resp.error);
          }
        });
      }
      return false;
    });

    $('.filter-form').on('submit', function(e) {
      var jid = activeBoard.jid;
      var formData = $(e.target).serializeObject();

      // Adjust for JID inconsistency
      if (jid && jid.substring(jid.length - 3) != "/WI" && jid.substring(0,2) == "wi") {
        jid += '/WI';
      } else if (jid && jid.substring(jid.length - 3) != "/IB") {
        jid += '/IB';
      }
      
      $.get('/msg', {
        jid: jid,
        numMessages: formData.numMessages,
        queryJson: formData.queryJson
      }, function(data, success, jqXhr) {
        $msgContainer.empty();
        if (data.status == 200) {
          data.messages.forEach(function(msg) {
            appendMessage(msg);
          });
        }
      });
      return false;
    });

    $('button.sms-command').on('click', function(e) {
      var commandName = $(this).data('command');
      var toNumber = activeBoard.simnumber;
      if (confirmCommandSend($(this), commandName)) {
        $.post('/sms', {
          cmd: commandName,
          to: toNumber
        }, function() {
        });
      }
    });

    $('.panel-clear button').on('click', function(e) {
      $msgContainer.empty();
    });

    $('#ib-board-chooser').select2({
      placeholder: "Select an Intelligent Board",
      formatResult: format,
      formatSelection: format,
      escapeMarkup: function(m) { return m; }
    });

    $('#ib-board-chooser').change(function(e){
      if(e.target.selectedOptions && e.target.selectedOptions.length) {
        var selectedBoard = $(e.target.selectedOptions[0]);
        var jid = selectedBoard.data('jid');

        var board = boardList.getBoardByJid(jid);
        selectBoard(board);
      }
    });
  }

  self.init = init;
  self.handleEvent = function(e) {
    e.msgs && e.msgs.forEach(function(msg) {
      if (msg.from.indexOf(activeBoard.jid) > -1) {
        appendMessage(msg);
      }
    })
  };

  return self;
})(window.jQuery, bigboss || {})

$(function() {
  bigboss.init();
  bigboss.eventManager.init();
  bigboss.eventDispatcher.init();
  bigboss.eventManager.addEventListener('onmessage', bigboss);
});

