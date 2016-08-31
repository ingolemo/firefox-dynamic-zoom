var background_page = chrome.extension.getBackgroundPage();

document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("width-choice")) {
    return;
  }

  var chosen_width = e.target.textContent;
  background_page.set_width(chosen_width);
});
