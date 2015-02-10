function save() {
  var editor = ace.edit("editor");
  $.post("/slides.md", editor.getValue());

  var iframe = document.getElementById('slides-frame');
  iframe.contentWindow.location.reload(true);
}
