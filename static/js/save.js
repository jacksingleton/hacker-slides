$(function() {
  function reloadMarkdown() {
    $('#slides-frame')[0].contentWindow.postMessage(JSON.stringify({
      method: 'reloadMarkdown'
    }), window.location.origin);
  }

  window.save = function() {
    var markdown,
        editor;

    if (plainTextMode()) {
      editor = $('#editor textarea')[0];
      markdown = editor.value;
    } else {
      editor = ace.edit("editor");
      markdown = editor.getValue();
    }

    $.ajax("/slides.md", {
      type: 'put',
      data: markdown,
      success: reloadMarkdown
    });
  };

  $('#editor').keyup($.debounce(window.save, 300));
});
