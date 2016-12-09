var width = 1200
var enabled = true

function set_width(num) {
	width = num
}

function toggle_enable() {
	enabled = !enabled
	return enabled
}

function rezoom(tab) {
	var zoom_level = 1;
	if (enabled) {
		zoom_level = tab.width / width
	}
	browser.tabs.setZoom(tab.id, zoom_level);
}

browser.tabs.onActivated.addListener(function (activeInfo) {
	browser.tabs.get(activeInfo.tabId, rezoom);
});

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	rezoom(tab);
});

function rezoom_all() {
	browser.tabs.query({
		"active": true,
	}, function (tabs) {
		for (tabData in tabs) {
			rezoom(tabs[tabData]);
		}
	});
}

function rezoom_all_callback() {
	rezoom_all()
	setTimeout(rezoom_all_callback, 5000);
}
rezoom_all_callback();
