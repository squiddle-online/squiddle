const NotificationType = {
    INVITATION: 0,
    INVITATION_ACCEPT: 1,
    INVITATION_DECLINE: 2,

    toString: function(type) {
        switch(type) {
        case this.INVITATION: return "Group Invitation";
        case this.INVITATION_ACCEPT: return "Invitation Accept";
        case this.INVITATION_DECLINE: return "Invitation Decline";
        default: return "Unknown";
        }
    }
};

var jsonResult = null;
var selectedNotification = null;
var notificationListElement = null;

window.addEventListener("load", function() {
    notificationListElement = document.getElementById("notification-list");
    pullNotifications();
});

function pullNotifications() {
    notificationRequest = new XMLHttpRequest();

    notificationRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            jsonResult = JSON.parse(this.responseText);
            populateNotifications();
        }
    }

    notificationRequest.open("GET", "/services/notifications/", true);
    notificationRequest.send();
}

function populateNotifications() {
    for (let i = 0; i < jsonResult.notificationList.length; i++) {
        let element = makeNotificationElement(jsonResult.notificationList[i], i);
        notificationListElement.appendChild(element);
    }
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
        selectNotification(this);
    };

    let senderLabel = document.createElement("p");
    senderLabel.setAttribute("class", "title");
    senderLabel.setAttribute("style", "display: inline-block;");
    senderLabel.innerHTML = "Sender:&nbsp";

    let sender = document.createElement("p");
    sender.setAttribute("style", "display: inline-block;");
    sender.setAttribute("class", "text");
    sender.innerHTML = ("User <i>" + notification.sender + "</i>");

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
    button.addEventListener("click", function() {
        removeNotification(rootElement, index);
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

function selectNotification(notification) {
    console.log("selected notification");
    if (selectedNotification)
        selectedNotification.classList.remove("selected-notification");

    selectedNotification = notification;
    selectedNotification.classList.add("selected-notification");
}

function removeNotification(notification, index) {
    var removalRequest = new XMLHttpRequest();
    removalRequest.open("POST", "/services/notifications/remove/", true);
    removalRequest.setRequestHeader("Content-type", "application/json");
    removalRequest.send(JSON.stringify(jsonResult.notificationList[index]));
    notification.parentNode.removeChild(notification);
}



