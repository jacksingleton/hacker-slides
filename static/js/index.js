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
      "v" : subSlide,
    };
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
        args: [currentSlide.h, currentSlide.v]
      }), window.location.origin);
    });
});
