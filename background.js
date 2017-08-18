function set_width(num) {
    return browser.storage.local.set({
        width: num
    }).then(rezoom_all)
}

function rezoom(tab) {
    browser.storage.local.get('width').then(function(items) {
        var width = items.width;
        var zoom_level = 1;

        if (!isNaN(width)) {
            zoom_level = Math.max(0.3, Math.min(tab.width / width, 3));
        }

        browser.tabs.getZoom(tab.id).then(function(current_zoom) {
            if (current_zoom != zoom_level) {
                browser.tabs.setZoom(tab.id, zoom_level);
            }
        });
    });
}

function rezoom_all() {
    browser.tabs.query({
        "active": true,
    }, function(tabs) {
        for (tabData in tabs) {
            rezoom(tabs[tabData]);
        }
    });
}

browser.tabs.onActivated.addListener(function(activeInfo) {
    browser.tabs.get(activeInfo.tabId, rezoom);
});

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    rezoom(tab);
});

browser.runtime.onMessage.addListener(function(message, sender) {
    if (message.greeting === "resize") {
        rezoom_all();
    }
});

setInterval(rezoom_all, 30 * 1000);