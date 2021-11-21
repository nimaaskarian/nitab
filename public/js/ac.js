function autocompleteCallback(e) {
  var evt = document.createEvent("Event");
  evt.initEvent("autocomplete", true, true);
  evt.ac = e;
  document.dispatchEvent(evt);
}
function resetStorage() {
  var evt = document.createEvent("Event");
  evt.initEvent("reset", true, true);
  document.dispatchEvent(evt);
}