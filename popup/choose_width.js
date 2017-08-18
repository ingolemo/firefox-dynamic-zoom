function set_selected_class() {
    browser.storage.local.get("width").then(function(items) {
        var value;
        if (isNaN(items.width)) {
            value = "Disable";
        } else {
            value = items.width.toString();
        }

        choices = document.getElementsByClassName("choice");
        var i;
        for (i = 0; i < choices.length; i++) {
            var choice = choices[i];
            if (choice.textContent === value) {
                choice.classList.add('selected');
            } else {
                choice.classList.remove('selected');
            }
        }
    });
}

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("choice")) {
        var chosen_width = parseInt(e.target.textContent, 10);
        chrome.extension.getBackgroundPage()
            .set_width(chosen_width)
            .then(set_selected_class);
    }
});

document.addEventListener("DOMContentLoaded", function(e) {
    set_selected_class();
});