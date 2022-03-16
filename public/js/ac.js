function autocompleteCallback(e) {
  var evt = document.createEvent("Event");
  evt.initEvent("autocomplete", true, true);
  evt.ac = e;
  document.dispatchEvent(evt);
}

var chrome = chrome || null;
