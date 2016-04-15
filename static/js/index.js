$(function() {

  function slideSeparatorLines(text) {
    var lines = text.split('\n');

    var separatorLineNumbers = [];

    var slideIndex = 0 ;
    var subSlideIndex = 0 ;

    for (i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line === '---') {
			var result = {
			"index" :  i,
			"slide" : slideIndex++,
			"subSlide" : 0
			};
			separatorLineNumbers.push(result);
                        subSlideIndex = 0
		} else if (line === '--') {
			var result = {
			"index" :  i,
			"slide" : slideIndex,
			"subSlide" : subSlideIndex++
			};
			separatorLineNumbers.push(result);
		}
    }

    return separatorLineNumbers;
  }

  function currentCursorSlide(cursorLine) {
    var text = ace.edit("editor").getValue();
    var separatorPositions = slideSeparatorLines(text);
    var slideNumber = {
	"h" : separatorPositions.length,
        "v" : 0
    };
    separatorPositions.every(function(pos, num) {
      if (pos.index >= cursorLine) {
        slideNumber.h = pos.slide;
        slideNumber.v = pos.subSlide;
        return false;
      }
      return true;
    });
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
        args: [currentSlide.h,currentSlide.v]
      }), window.location.origin);
    });
});
