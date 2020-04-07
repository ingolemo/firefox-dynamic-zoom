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
        await browser.storage.local.set({ width: chosen_width });
      });
    });

  var checkbox = document.getElementById("enabled");
  var enabled = await bgPage.get_pref("enabled");
  checkbox.checked = enabled;
  checkbox.addEventListener("input", async function (e) {
    await browser.storage.local.set({ enabled: this.checked });
  });

  var max_zoom = document.getElementById('max_zoom')
  max_zoom.value = await bgPage.get_pref('max')
  max_zoom.addEventListener('input', async function (e) {
    await browser.storage.local.set({ max: this.value })
  });

  var width = await bgPage.get_pref("width");
  set_selected_class(width);

  browser.storage.onChanged.addListener(async function (changes, areaName) {
    if (areaName !== "local") {
      return;
    }
    if (changes.hasOwnProperty("enabled")) {
      checkbox.checked = changes.enabled.newValue;
    }
    if (changes.hasOwnProperty("width")) {
      set_selected_class(changes.width.newValue);
    }
    if (changes.hasOwnProperty('max')) {
      max_zoom.value = changes.max.newValue
    }
  });
});
