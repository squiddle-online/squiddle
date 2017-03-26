var header = {};

//! Called when the body is loaded.
function init() {
    _grab_elements();
    _register_callbacks();
}

// button click listeners

function toggle_action_menu() {
    _toggle_container(header.action_menu);
    if (_toggle_button(this)) {
        _close_container_if_open(header.notification_display_button, header.notification_display);
        _close_container_if_open(header.meta_action_menu_button, header.meta_action_menu);
    }
}

function toggle_meta_action_menu() {
    _toggle_container(header.meta_action_menu);
    if (_toggle_button(this)) {
        _close_container_if_open(header.notification_display_button, header.notification_display);
        _close_container_if_open(header.action_menu_button, header.action_menu);
    }
}

function toggle_notification_display() {
    _toggle_container(header.notification_display);
    if (_toggle_button(this)) {
        _close_container_if_open(header.meta_action_menu_button, header.meta_action_menu);
        _close_container_if_open(header.action_menu_button, header.action_menu);
    }
}


// Helpers


function _grab_elements() {
    header.action_menu = document.getElementById("action-menu");
    header.action_menu_button = document.getElementById("action-menu-button");

    header.meta_action_menu = document.getElementById("meta-action-menu");
    header.meta_action_menu_button = document.getElementById("meta-action-menu-button");

    header.notification_display = document.getElementById("notification-display");
    header.notification_display_button = document.getElementById("notification-display-button");
}

function _register_callbacks() {
    header.action_menu_button.onclick = toggle_action_menu;
    header.meta_action_menu_button.onclick = toggle_meta_action_menu;
    header.notification_display_button.onclick = toggle_notification_display;
}


function _toggle_button(button) {
    return button.classList.toggle("toggled-button");
}

function _toggle_container(container) {
    var justHid = container.classList.toggle("invisible");
    if (justHid) container.parentElement.style = "display:none;";
    else container.parentElement.style = "";

    return container.classList.toggle("visible");
}

function _close_container_if_open(button, container) {
    if (container.classList.contains("visible")) {
        _toggle_container(container);
        _toggle_button(button);
        return true;
    }
    return false;
}

