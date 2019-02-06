function should_resize() {
    return document.contentType == "text/html";
}

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.id === "dynamiczoom.can_resize") {
        sendResponse(should_resize());
    }
});

window.addEventListener("resize", function() {
  browser.runtime.sendMessage({ id: "dynamiczoom.resize" });
});
