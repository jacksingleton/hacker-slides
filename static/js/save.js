function save() {
  var editor = ace.edit("editor");
  $.post("/slides.md", editor.getValue());
  $('#slides-frame')[0].contentWindow.postMessage('save', window.location.origin)
}
