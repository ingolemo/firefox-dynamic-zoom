var bgPage = browser.extension.getBackgroundPage();

function set_selected_class(width) {
  var value = width.toString();
  if (value === "0") {
    value = "Disable";
  }

  document
    .querySelectorAll("#choices > .choice")
    .forEach(async function (choice) {
      if (choice.textContent === value) {
        choice.classList.add("selected");
      } else {
        choice.classList.remove("selected");
      }
    });
}

document.addEventListener("DOMContentLoaded", async function (e) {
  document
    .querySelectorAll("#choices > .choice")
    .forEach(async function (choice) {
      choice.addEventListener("click", async function (e) {
        var chosen_width = parseInt(e.target.textContent, 10);
        if (isNaN(chosen_width)) {
          chosen_width = 0;
        }
        set_selected_class(chosen_width);
        await bgPage.set_width(chosen_width);
      });
    });

  var width = await bgPage.get_width();
  set_selected_class(width);
});
