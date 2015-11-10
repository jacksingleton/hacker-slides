$(function() {

  function slideSeparatorLines(text) {
    var lines = text.split('\n');

    var separatorLineNumbers = [];

    for (i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line === '---') {
        separatorLineNumbers.push(i);
      }
    }

    return separatorLineNumbers;
  }

  function currentCursorSlide(cursorLine) {
    var text = ace.edit("editor").getValue();
    var separatorPositions = slideSeparatorLines(text);
    var slideNumber = separatorPositions.length;
    separatorPositions.every(function(pos, num) {
      if (pos >= cursorLine) {
        slideNumber = num;
        return false;
      }
      return true;
    });
    return slideNumber;
  }


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
      args: [currentSlide]
    }), window.location.origin);
  });
});



