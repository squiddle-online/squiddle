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
    for (let n of jsonResult.notificationList) {
        let element = makeNotificationElement(n);
        notificationListElement.appendChild(element);
    }
}

function makeNotificationElement(notification, removalInfo) {
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

    rootElement.appendChild(senderLabel);
    rootElement.appendChild(sender);
    rootElement.appendChild(br);
    rootElement.appendChild(typeLabel);
    rootElement.appendChild(type);

    return rootElement;
}

function selectNotification(notification) {
    console.log("selected notification");
}
