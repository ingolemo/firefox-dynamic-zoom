window.addEventListener("resize", function() {
	browser.runtime.sendMessage({greeting: "resize"});
});
