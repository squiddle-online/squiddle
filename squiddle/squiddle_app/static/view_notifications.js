const NotificationType = {
    INVITATION: 0,
    INVITATION_ACCEPTED: 1,
    INVITATION_INVITATION_DECLINED: 2,

    toString: function(type) {
        switch(type) {
        case this.INVITATION: return "Group Invitation";
        case this.INVITATION_ACCEPTED: return "Invitation Accepted";
        case this.INVITATION_INVITATION_DECLINED: return "Invitation Declined";
        default: return "Unknown";
        }
    }
};

var jsonResult = null;
var selectedNotificationElement = null;
var selectedNotification = null;
var notificationListElement = null;

window.addEventListener("load", function() {
    notificationListElement = document.getElementById("notification-list");
    document.getElementById("invitation-accept-button").addEventListener("click", acceptInvitation);
    document.getElementById("invitation-decline-button").addEventListener("click", declineInvitation);

    pullNotifications();
});

function pullNotifications() {
    notificationRequest = new XMLHttpRequest();

    notificationRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            jsonResult = JSON.parse(this.responseText);
            populateNotifications();
        }
    }

    notificationRequest.open("GET", "/services/notifications/get/", true);
    notificationRequest.send();
}

function populateNotifications() {
    let numNotification = jsonResult.notificationList.length;
    for (let i = 0; i < numNotification; i++) {
        let element = makeNotificationElement(jsonResult.notificationList[i], i);
        notificationListElement.appendChild(element);
    }

    selectNextNotification();
}

function makeNotificationElement(notification, index) {
// Making one of these:
//
// <div class="notification">
//   <p class="title" style="display: inline-block;">Source:</p>
//   <p style="display: inline-block;">User <i>rationalcoder</i></p>
//   <br>
//   <p class="title" style="display: inline-block;">Type:</p>
//   <p style="display: inline-block;">Group Invitation</p>
// </div>

    let rootElement = document.createElement("div");
    rootElement.setAttribute("class", "notification");
    rootElement.onclick = function() {
        selectNotification(this, notification);
    };

    let senderLabel = document.createElement("p");
    senderLabel.setAttribute("class", "title");
    senderLabel.setAttribute("style", "display: inline-block;");
    senderLabel.innerHTML = "Sender:&nbsp";

    let sender = document.createElement("p");
    sender.setAttribute("style", "display: inline-block;");
    sender.setAttribute("class", "text");
    sender.innerHTML = ("User <i>" + notification.sender_name + "</i>");

    let br = document.createElement("br");

    let typeLabel = document.createElement("p");
    typeLabel.setAttribute("class", "title");
    typeLabel.setAttribute("style", "display: inline-block;");
    typeLabel.innerHTML = "Type:&nbsp";

    let type = document.createElement("type");
    type.setAttribute("class", "text");
    type.setAttribute("style", "display: inline-block;");
    type.innerHTML = NotificationType.toString(notification.type);

    let button = document.createElement("button");
    button.setAttribute("class", "close close-button");
    button.setAttribute("aria-label", "Close");
    button.addEventListener("click", function(event) {
        removeNotification(rootElement, index);
        event.stopPropagation();
    });

    let span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.setAttribute("style", "font-size: 55px;");
    span.innerHTML = "&times;";

    button.appendChild(span);

    rootElement.appendChild(senderLabel);
    rootElement.appendChild(sender);
    rootElement.appendChild(br);
    rootElement.appendChild(typeLabel);
    rootElement.appendChild(type);
    rootElement.appendChild(button);

    return rootElement;
}

function selectNotification(notificationElement, notification) {
    if (selectedNotificationElement)
        selectedNotificationElement.classList.remove("selected-notification");

    selectedNotificationElement = notificationElement;
    selectedNotificationElement.classList.add("selected-notification");

    selectedNotification = notification;

    showNotificationOptions(notification);
}

function removeNotification(notification, index) {
    var removalRequest = new XMLHttpRequest();
    removalRequest.open("POST", "/services/notifications/remove/" + jsonResult.notificationList[index].id, true);
    removalRequest.setRequestHeader("Content-type", "application/json");
    removalRequest.send();
    jsonResult.notificationList.splice(index, 1);
    if (notification == selectedNotificationElement)
        hideOptions();

    notification.parentNode.removeChild(notification);
}

function acceptInvitation() {
    this.blur();
    if (!selectedNotification || selectedNotification.type != NotificationType.INVITATION)
        throw "acceptInvitation() called on invalid notification.";

    removeNotification(selectedNotificationElement, notificationIndex(selectedNotificationElement));
    hideOptions();
    selectNextNotification()
}

function declineInvitation() {
    this.blur();
    if (!selectedNotification || selectedNotification.type != NotificationType.INVITATION)
        throw "declineInvitation() called on invalid notification.";

    removeNotification(selectedNotificationElement, notificationIndex(selectedNotificationElement));
    hideOptions();
    selectNextNotification()
}

function notificationIndex(element) {
    var node = element;
    for (var i = 0; (node = node.previousElementSibling); i++);
    return i;
}

function hideOptions() {
    for (let elem of document.getElementById("notification-menu").children)
        elem.classList.add("hidden");
}

function selectNextNotification() {
    if (jsonResult.notificationList.length) {
        selectNotification(notificationListElement.firstElementChild, jsonResult.notificationList[0]);
    }
}

function showNotificationOptions(notification) {
    hideOptions();
    // Make them all hidden by default, then make the one we need visible.
    var optionElement = null;
    switch (notification.type) {
    case NotificationType.INVITATION:
        optionElement = document.getElementById("invitation-options");

        document.getElementById("invitation-options-message").innerHTML =
                                "<i>" + selectedNotification.sender_name +"</i>" +
                                " Has Invited You to Join <i>" + selectedNotification.group_name + "</i>";

        optionElement.classList.remove("hidden");
        break;
    case NotificationType.INVITATION_ACCEPTED:
        optionElement = document.getElementById("invitation-accepted-message");

        document.getElementById("invitation-accepted-message-text").innerHTML = "Test Accept";

        optionElement.classList.remove("hidden");
        break;
    case NotificationType.INVITATION_INVITATION_DECLINED:
        optionElement = document.getElementById("invitation-declined-message");

        document.getElementById("invitation-declined-message-text").innerHTML = "Test Decline";

        optionElement.classList.remove("hidden");
        break;
    default: break;
    }
}

