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
  setTimeout(function(){
    $('button.collapse-toggle').on('click', function(e) {
      var target_selector = $(this).data('target');
      var $target = $(target_selector);
      $(this).toggleClass('collapsed');
      $target.slideToggle('fast');
    });

    $('.upload-panel').each(function(i, el) {
      var $el = $(el);
      $el.find('.picker-start').datetimepicker({useSeconds:true});
      $el.find('.picker-end').datetimepicker({useSeconds:true});
    })
  }, 0);
});