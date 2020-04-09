async function get_pref(name) {
  var defaults = { width: 1280, enabled: true, max: 3.0 };
  var getter = {};
  getter[name] = defaults[name];
  var storage = await browser.storage.local.get(getter);
  return storage[name];
}

function round(num) {
  return Math.round(num * 100) / 100;
}

async function rezoom_tab(tab, width) {
  var enabled = await get_pref("enabled");
  if (!enabled) {
    return;
  }

  var can_resize = await browser.tabs.sendMessage(tab.id, {
    id: "dynamiczoom.can_resize",
  });
  if (!can_resize) {
    return;
  }

  var window = await browser.windows.get(tab.windowId);
  if (window.focused != true) {
    return;
  }
  if (window.type != "normal") {
    return;
  }

  var zoom_level = 1;
  if (width != 0) {
    var max_zoom = await get_pref("max");
    zoom_level = tab.width / width;
    zoom_level = Math.max(0.3, Math.min(zoom_level, max_zoom));
  }

  var current_zoom = await browser.tabs.getZoom(tab.id);
  if (round(current_zoom) != round(zoom_level)) {
    browser.tabs.setZoom(tab.id, zoom_level);
  }
}

async function rezoom_all_tabs() {
  var width = await get_pref("width");
  var tabs = await browser.tabs.query({ active: true });
  for (tabIndex in tabs) {
    rezoom_tab(tabs[tabIndex], width);
  }
}

async function unzoom_all_tabs() {
  var tabs = await browser.tabs.query({ active: true });
  for (tabIndex in tabs) {
    var tab = tabs[tabIndex];
    var can_resize = await browser.tabs.sendMessage(tab.id, {
      id: "dynamiczoom.can_resize",
    });
    if (!can_resize) {
      continue;
    }

    browser.tabs.setZoom(tab.id, 1.0);
  }
}

browser.commands.onCommand.addListener(async function (command) {
  if (command == "toggle-dynamic-zoom") {
    var enabled = await get_pref("enabled");
    browser.storage.local.set({ enabled: !enabled });
  } else if (command == "increase-dynamic-zoom") {
    var width = await get_pref("width");
    var new_width = width * 1.1;
    browser.storage.local.set({ width: new_width });
  } else if (command == "decrease-dynamic-zoom") {
    var width = await get_pref("width");
    var new_width = width * 0.9;
    browser.storage.local.set({ width: new_width });
  }
});

browser.storage.onChanged.addListener(async function (changes, areaName) {
  if (changes.hasOwnProperty("enabled") && changes.enabled.newValue === false) {
    unzoom_all_tabs();
  }
});

// set zoom the user switches tabs
browser.tabs.onActivated.addListener(async function (activeInfo) {
  var tab = await browser.tabs.get(activeInfo.tabId);
  var width = await get_pref("width");
  rezoom_tab(tab, width);
});

// set zoom when the user navigates to a new url
browser.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  var width = await get_pref("width");
  rezoom_tab(tab, width);
});

// set zoom when the window is resized
browser.runtime.onMessage.addListener(async function (message, sender) {
  if (message.id === "dynamiczoom.resize") {
    rezoom_all_tabs();
  }
});

// set zoom when the window focus changes
browser.windows.onFocusChanged.addListener(async function (windowId) {
  rezoom_all_tabs();
});

// set zoom when any preferences change
browser.storage.onChanged.addListener(async function (changes, areaName) {
  rezoom_all_tabs();
});

// set zoom intermittantly (just in case I missed something)
setInterval(async function () {
  rezoom_all_tabs();
}, 30 * 1000);

// set zoom when extension starts
rezoom_all_tabs();
