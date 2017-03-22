//! Called when the body is loaded.
function init() {

}

function _toggle_element(elem_id, display = "block") {
    var elem = document.getElementById(elem_id);
    if (elem.style.display == "none")
        elem.style.display = display;
    else
        elem.style.display = "none";
}

function toggle_action_menu() {
    _toggle_element("action-menu");
}

function toggle_meta_action_menu() {
    _toggle_element("meta-action-menu");
}

function toggle_notification_display() {
    _toggle_element("notification-display");
}
