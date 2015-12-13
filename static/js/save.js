$(function() {
  function reloadMarkdown() {
    $('#slides-frame')[0].contentWindow.postMessage(JSON.stringify({
      method: 'reloadMarkdown'
    }), window.location.origin);
  }

  window.save = function() {
    var editor = ace.edit("editor");

    $.ajax("/slides.md", {
      type: 'put',
      data: editor.getValue(),
      success: reloadMarkdown
    });
  };

  $('#editor').keyup($.debounce(window.save, 300));
});
