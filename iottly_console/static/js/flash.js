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

$(function() {
  $('.fw-chooser').on('change', function(e) {
    var area = parseInt($(this).data('area'));
    setProgress(area, 0, 1);
    if(e.target.selectedOptions && e.target.selectedOptions.length) {
      var selectedFW = $(e.target.selectedOptions[0]);
      var md5 = selectedFW.data('md5');
      $(this).parents('form').find('.fw-md5').val(md5);
    }
  });

  function setProgress(area, sent, total) {
    var $pBar = $('.progress-bar.area-'+area);
    $pBar.addClass('active');
    $pBar.attr('aria-valuemax', total);
    $pBar.attr('aria-valuenow', sent);
    $pBar.css({width: ((sent/total) * 100) + "%"});
    var msg = "Sent "+sent+" chunks of "+total;
    if (sent == total) {
      msg = "Transfer Complete!";
      $pBar.removeClass('active');
    } else if (sent == 0) {
      $pBar.removeClass('active');
      msg = '';
    }
    $pBar.text(msg);
  }

  var listener = {

    handleEvent: function(e) {
      if (e.type && e.type == 'progress') {
        setProgress(e.area, e.chunks_sent, e.total_chunks);
      }
    }
  }

  setTimeout(function(){
    bigboss.eventManager.addEventListener('onmessage', listener)
  }, 0);
});
