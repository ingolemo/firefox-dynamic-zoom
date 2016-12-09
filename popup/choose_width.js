function enable(element) {
	element.textContent = "Enabled"
	element.className = "enabled"
}

function disable(element) {
	element.textContent = "Disabled"
	element.className = "disabled"
}

var background_page = chrome.extension.getBackgroundPage();
var element = document.getElementById("width-enable")
if (background_page.enabled) {
	enable(element)
} else {
	disable(element)
}

document.addEventListener("click", function(e) {
	if (e.target.classList.contains("width-choice")) {
		var chosen_width = e.target.textContent;
		background_page.set_width(chosen_width);
		background_page.rezoom_all()
	}
	if (e.target.id == "width-enable") {
		var enabled = background_page.toggle_enable();
		if (enabled) {
			enable(e.target)
		} else {
			disable(e.target)
		}
		background_page.rezoom_all()
	}
});
