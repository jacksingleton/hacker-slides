function save() {
  var editor = ace.edit("editor");
  $.ajax("/slides.md", {type: 'put', data: editor.getValue()});
  $('#slides-frame')[0].contentWindow.postMessage('save', window.location.origin)
}
