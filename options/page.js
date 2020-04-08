var bgPage = browser.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", async function (e) {
  var checkbox = document.getElementById("enabled");
  var enabled = await bgPage.get_pref("enabled");
  checkbox.checked = enabled;
  checkbox.addEventListener("input", async function (e) {
    await browser.storage.local.set({ enabled: this.checked });
  });

  var simulated_width = document.getElementById('simulated_width')
  simulated_width.value = Math.round(await bgPage.get_pref('width'))
  simulated_width.addEventListener('input', async function (e) {
    await browser.storage.local.set({ width: this.value })
  });

  var max_zoom = document.getElementById('max_zoom')
  max_zoom.value = Math.round(100 * await bgPage.get_pref('max'))
  max_zoom.addEventListener('input', async function (e) {
    await browser.storage.local.set({ max: this.value / 100 })
  });

  browser.storage.onChanged.addListener(async function (changes, areaName) {
    if (areaName !== "local") {
      return;
    }
    if (changes.hasOwnProperty("enabled")) {
      checkbox.checked = changes.enabled.newValue;
    }
    if (changes.hasOwnProperty("width")) {
      simulated_width.value = Math.round(changes.width.newValue)
    }
    if (changes.hasOwnProperty('max')) {
      max_zoom.value = Math.round(changes.max.newValue * 100)
    }
  });
});
