window.addEventListener("resize", function() {
  browser.runtime.sendMessage({ id: "dynamiczoom.resize" });
});
