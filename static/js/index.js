function plainTextMode() {
  var queryString = document.location.search;
  return queryString.indexOf('plain-text-mode') > -1;
}

$(function() {

  function currentCursorSlide(cursorLine) {
    var text = ace.edit("editor").getValue();
    var lines = text.split('\n');
    var line = "";
    var slide = 0;
    var subSlide = 0;

    for (i = 0; i <= cursorLine; i++) {
      if (line.substring(0,3) === '---') {
        slide = slide + 1;
        subSlide = 0;
      } else if (line.substring(0,2) === '--') {
        subSlide = subSlide + 1;
      }
      line = lines[i];
    }
    var slideNumber = {
      "h" : slide,
      "v" : subSlide
    };
    return slideNumber;
  } 

  function setupAceEditor() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setMode("ace/mode/markdown");
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(true);

    $.get('/slides.md', function(data) {
      editor.setValue(data, -1);
    });

    ace.edit('editor').getSession().selection.on('changeCursor', function(e) {
      var cursorRow = ace.edit('editor').getCursorPosition().row;
      var currentSlide = currentCursorSlide(cursorRow);
      $('#slides-frame')[0].contentWindow.postMessage(JSON.stringify({
        method: 'slide',
        args: [currentSlide.h, currentSlide.v]
      }), window.location.origin);
    });
  }

  function setupTextArea() {
    var textArea = $('<textarea>');

    $('#editor').html(textArea);

    $.get('/slides.md', function(data) {
      textArea[0].value = data;
    });
  }

  function updateTextModeLink(text, href) {
    var link = $('#plain-text-link');
    link.text(text);
    link.attr('href', href);
  }

  if (plainTextMode()) {
    setupTextArea();
    updateTextModeLink('Rich-Text Mode', '/');
  } else {
    setupAceEditor();
    updateTextModeLink('Plain-Text Mode', '/?plain-text-mode');
  }
});
