browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.id === "dynamiczoom.can_resize") {
    var should_resize = document.contentType == "text/html";
    sendResponse(should_resize);
  }
});

window.addEventListener("resize", function() {
  browser.runtime.sendMessage({ id: "dynamiczoom.resize" });
});
