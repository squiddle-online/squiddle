var header = {};

window.addEventListener("load", function() {
    grabElements();
    registerCallbacks();
});

// button click listeners

function toggleActionMenu() {
    toggleContainer(header.actionMenu);
    if (toggleButton(this)) {
        closeContainerIfOpen(header.metaActionMenuButton, header.metaActionMenu);
    }
}

function toggleMetaActionMenu() {
    toggleContainer(header.metaActionMenu);
    if (toggleButton(this)) {
        closeContainerIfOpen(header.actionMenuButton, header.actionMenu);
    }
}

function showNotificationDisplay() {
    closeContainerIfOpen(header.actionMenuButton, header.actionMenu);
    closeContainerIfOpen(header.metaActionMenuButton, header.metaActionMenu);
}


// Helpers


function grabElements() {
    header.actionMenu = document.getElementById("action-menu");
    header.actionMenuButton = document.getElementById("action-menu-button");

    header.metaActionMenu = document.getElementById("meta-action-menu");
    header.metaActionMenuButton = document.getElementById("meta-action-menu-button");

    header.notificationDisplay = document.getElementById("notification-display");
    header.notificationDisplayButton = document.getElementById("notification-display-button");
}

function registerCallbacks() {
    header.actionMenuButton.onclick = toggleActionMenu;
    header.metaActionMenuButton.onclick = toggleMetaActionMenu;
    header.notificationDisplayButton.onclick = showNotificationDisplay;
}


function toggleButton(button) {
    return button.classList.toggle("toggled-button");
}

function toggleContainer(container) {
    var justHid = container.classList.toggle("invisible");
    if (justHid) container.parentElement.style = "display:none;";
    else container.parentElement.style = "";

    return container.classList.toggle("visible");
}

function closeContainerIfOpen(button, container) {
    if (container.classList.contains("visible")) {
        toggleContainer(container);
        toggleButton(button);
        return true;
    }
    return false;
}

