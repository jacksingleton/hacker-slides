function save() {
  var editor = ace.edit("edit");
  $.post("/slides.md", editor.getValue());

  var iframe = document.getElementById('slides-frame');
  iframe.src = iframe.src;
}
