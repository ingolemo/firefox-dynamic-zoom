function rezoom(tab) {
	browser.tabs.setZoom(tab.id, tab.width / 1200);
}

browser.tabs.onActivated.addListener(function (activeInfo) {
	browser.tabs.get(activeInfo.tabId, rezoom);
});

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	rezoom(tab);
});

function to() {
	browser.tabs.query({
		"active": true,
	}, function (tabs) {
		for (tabData in tabs) {
			rezoom(tabs[tabData]);
		}
	});
	setTimeout(to, 2000);
}
to();
