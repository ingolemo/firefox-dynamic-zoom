var bgPage = browser.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", async function (e) {
  var checkbox = document.getElementById("enabled");
  var enabled = await bgPage.get_pref("enabled");
  checkbox.checked = enabled;
  checkbox.addEventListener("input", async function (e) {
    await browser.storage.local.set({ enabled: this.checked });
  });

  var simulated_width = document.getElementById("simulated_width");
  simulated_width.value = Math.round(await bgPage.get_pref("width"));
  simulated_width.addEventListener("input", async function (e) {
    await browser.storage.local.set({ width: this.value });
  });

  var max_zoom = document.getElementById("max_zoom");
  max_zoom.value = Math.round(100 * (await bgPage.get_pref("max")));
  max_zoom.addEventListener("input", async function (e) {
    await browser.storage.local.set({ max: this.value / 100 });
  });

  var keybinds = document.querySelector("dl#keybinds");
  var commands = await browser.commands.getAll();
  commands.forEach(async function (command) {
    var dt = document.createElement("dt");
    var text = document.createTextNode(command.description);
    dt.appendChild(text);
    keybinds.appendChild(dt);

    var dd = document.createElement("dd");
    var text = document.createTextNode(command.shortcut);
    dd.appendChild(text);
    keybinds.appendChild(dd);
  });

  browser.storage.onChanged.addListener(async function (changes, areaName) {
    if (areaName !== "local") {
      return;
    }
    if (changes.hasOwnProperty("enabled")) {
      checkbox.checked = changes.enabled.newValue;
    }
    if (changes.hasOwnProperty("width")) {
      var new_width = Math.round(changes.width.newValue);
      if (new_width >= 800) {
        simulated_width.value = new_width;
      }
    }
    if (changes.hasOwnProperty("max")) {
      max_zoom.value = Math.round(changes.max.newValue * 100);
    }
  });
});
