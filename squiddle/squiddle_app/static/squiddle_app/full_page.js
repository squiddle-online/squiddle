//! Called when the body is loaded.
function init() {
    document.getElementById("action-menu-button").addEventListener("click", toggle_action_menu);
    document.getElementById("meta-action-menu-button").addEventListener("click", toggle_meta_action_menu);
    document.getElementById("notification-display-button").addEventListener("click", toggle_notification_display);
}

function toggle_action_menu() {
    _toggle_button(this);
    _toggle_container("action-menu");
}

function toggle_meta_action_menu() {
    _toggle_button(this);
    _toggle_container("meta-action-menu");
}

function toggle_notification_display() {
    _toggle_button(this);
    _toggle_container("notification-display");
}

function _toggle_button(button) {
    button.classList.toggle("toggled-button");
}

function _toggle_container(container_id) {
    var container = document.getElementById(container_id);
    container.classList.toggle("invisible");
    container.classList.toggle("visible");
}

