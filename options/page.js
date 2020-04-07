var bgPage = browser.extension.getBackgroundPage();

function set_selected_class(width) {
  var value = width.toString();
  if (value === "0") {
    value = "Disable";
  }

  choices = document.getElementsByClassName("choice");
  var i;
  for (i = 0; i < choices.length; i++) {
    var choice = choices[i];
    if (choice.textContent === value) {
      choice.classList.add("selected");
    } else {
      choice.classList.remove("selected");
    }
  }
}

document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("choice")) {
    var chosen_width = parseInt(e.target.textContent, 10);
    if (isNaN(chosen_width)) {
      chosen_width = 0;
    }
    console.log(toString(chosen_width));
    var width = await bgPage.get_width();
    set_selected_class(width);
  }
});

document.addEventListener("DOMContentLoaded", async function (e) {
  var width = await bgPage.get_width();
  set_selected_class(width);
});
