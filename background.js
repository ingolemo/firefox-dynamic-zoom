async function get_width() {
  var storage = await browser.storage.local.get({ width: 1280 });
  return storage.width;
}

async function set_width(num) {
  await browser.storage.local.set({ width: num });
  rezoom_all_tabs(num);
  return num;
}

function round(num) {
  return Math.round(num * 100) / 100;
}

async function rezoom_tab(tab, width) {
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
    zoom_level = tab.width / width;
    zoom_level = Math.max(0.3, Math.min(zoom_level, 3));
  }

  var current_zoom = await browser.tabs.getZoom(tab.id);
  if (round(current_zoom) != round(zoom_level)) {
    browser.tabs.setZoom(tab.id, zoom_level);
  }
}

async function rezoom_all_tabs(width) {
  var tabs = await browser.tabs.query({ active: true });
  for (tabData in tabs) {
    rezoom_tab(tabs[tabData], width);
  }
}

browser.commands.onCommand.addListener(async function (command) {
  if (command == "increase-dynamic-zoom") {
    var width = await get_width();
    var new_width = width * 1.2;
    set_width(new_width);
  } else if (command == "decrease-dynamic-zoom") {
    var width = await get_width();
    var new_width = width * 0.8;
    set_width(new_width);
  }
});

// set zoom the user switches tabs
browser.tabs.onActivated.addListener(async function (activeInfo) {
  var tab = await browser.tabs.get(activeInfo.tabId);
  var width = await get_width();
  rezoom_tab(tab, width);
});

// set zoom when the user navigates to a new url
browser.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  var width = await get_width();
  rezoom_tab(tab, width);
});

// set zoom when the window is resized
browser.runtime.onMessage.addListener(async function (message, sender) {
  if (message.id === "dynamiczoom.resize") {
    var width = await get_width();
    rezoom_all_tabs(width);
  }
});

// set zoom when the window focus changes
browser.windows.onFocusChanged.addListener(async function (windowId) {
  var width = await get_width();
  rezoom_all_tabs(width);
});

// set zoom intermittantly (just in case I missed something)
setInterval(async function () {
  var width = await get_width();
  rezoom_all_tabs(width);
}, 30 * 1000);

// set zoom when extension starts
get_width().then(rezoom_all_tabs);
