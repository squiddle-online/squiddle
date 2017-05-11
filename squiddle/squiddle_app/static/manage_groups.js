
const GroupType = {
    OWNER: 0,
    MEMBER: 1,
};

var groupsJson = null;
var usersJson = null;
var selectedGroupType = null;
var selectedElement = null;
var selectedIndex = null;
var ownedGroupsListElem = null;
var memberOfGroupsListElem = null;
var userList = null;
var selectedUser = null;

window.addEventListener("load", function(){
    pullGroupInfo();

    ownedGroupsListElem = document.getElementById("owned-groups-list");
    memberOfGroupsListElem = document.getElementById("member-of-groups-list");
    userList = document.getElementById("user-list");

    document.getElementById("leave-group-button").addEventListener("click", leaveGroup);
    document.getElementById("disband-group-button").addEventListener("click", disbandGroup);
    document.getElementById("cancel-group-edits-button").addEventListener("click", cancelEdits);
    document.getElementById("save-group-edits-button").addEventListener("click", editGroup);
    document.getElementById("search-bar").addEventListener("input", pullUsers);
    document.getElementById("invite-member-button").addEventListener("click", inviteMember);
});

function pullGroupInfo() {
    var request = new XMLHttpRequest();
    request.open("GET", "/services/groups/", true);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            groupsJson = JSON.parse(this.responseText);
            populateGroupLists();
        }
    }
    request.send();
}

function pullUsers() {
    if (!this.value) {
        clearUserList();
        return;
    }

    var request = new XMLHttpRequest();
    request.open("GET", "/services/users/" + this.value, true);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            usersJson = JSON.parse(this.responseText);
            populateUserList();
        }
    }
    request.send();
}

function clearUserList() {
    userList.innerHTML = "";
    userList.classList.add("hidden");
    usersJson.users = [];
    selectedUser = null;
}

function populateUserList() {
    userList.innerHTML = "";
    if (!usersJson.users.length)
        return;

    for (let i = 0; i < usersJson.users.length; i++) {
        let user = usersJson.users[i];

        let elem = document.createElement("li");
        elem.innerHTML = "<b>" + user.name + "</b>";
        elem.onclick = function() {
            document.getElementById("search-bar").value = user.name;
            userList.classList.add("hidden");
            selectedUser = user;
        }

        userList.appendChild(elem);
    }

    userList.classList.remove("hidden");
}

function inviteMember() {
    if (!selectedUser) return;

    var request = new XMLHttpRequest();
    request.open("POST", "/services/notifications/invite/" +
                         groupsJson.groups.ownerOf[selectedIndex].id + "/" + selectedUser.id, true);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("search-bar").value = "";
            clearUserList();
        }
    }
    request.send();
}

function populateGroupLists() {
    populateOwnerOf();
    populateMemberOf();
}

var textEntryStyle = "margin: 0px; margin-left: auto; margin-right: auto; font-weight: bold; font-style: italic;";

function populateOwnerOf() {
    document.getElementById("owned-groups-list").innerHTML = "";

    for (let i = 0; i < groupsJson.groups.ownerOf.length; i++) {
        let g = groupsJson.groups.ownerOf[i];

        let entry = document.createElement("div");
        entry.setAttribute("class", "group-entry owned-group-entry");
        entry.onclick = function () {
            selectOwnerOfEntry(this, i);
            return false;
        }

        let text = document.createElement("p");
        text.setAttribute("class", "entry text");
        text.innerHTML = g.name;
        text.style = textEntryStyle;

        entry.appendChild(text);
        ownedGroupsListElem.appendChild(entry);
    }
}

function populateMemberOf() {
    document.getElementById("member-of-groups-list").innerHTML = "";

    for (let i = 0; i < groupsJson.groups.memberOf.length; i++) {
        let g = groupsJson.groups.memberOf[i];

        let entry = document.createElement("div");
        entry.setAttribute("class", "group-entry member-of-group-entry");
        entry.onclick = function () {
            selectMemberOfEntry(this, i);
            return false;
        }

        let text = document.createElement("p");
        text.setAttribute("class", "entry text");
        text.innerHTML = g.name;
        text.style = textEntryStyle;

        entry.appendChild(text);
        memberOfGroupsListElem.appendChild(entry);
    }
}

function selectOwnerOfEntry(elem, index) {
    if (selectedElement)
        selectedElement.classList.remove("selected");
    elem.classList.add("selected");

    selectedGroupType = GroupType.OWNER;
    selectedElement = elem;
    selectedIndex = index;

    hideOptions();
    document.getElementById("owner-options").classList.remove("hidden");

    var group = groupsJson.groups.ownerOf[selectedIndex];
    document.getElementById("id_name").value = group.name;
    document.getElementById("id_description").value = group.description;
}

function selectMemberOfEntry(elem, index) {
    if (selectedElement)
        selectedElement.classList.remove("selected");
    elem.classList.add("selected");

    selectedGroupType = GroupType.MEMBER;
    selectedElement = elem;
    selectedIndex = index;

    hideOptions();
    document.getElementById("member-options").classList.remove("hidden");
}

function hideOptions() {
    for (let options of document.getElementById("group-options").children)
        options.classList.add("hidden");
}

function editGroup() {
    this.blur();

    var request = new XMLHttpRequest();
    request.open("POST", "/services/groups/edit/", true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {
        var list = selectedGroupType == GroupType.OWNER ? groupsJson.groups.ownerOf : groupsJson.groups.memberOf;
        var group = list[selectedIndex];
        if (this.readyState == 4 && this.status == 200) {
            pullGroupInfo();
        }
        else {
            document.getElementById("id_name").value = group.name;
            document.getElementById("id_description").value = group.description;
        }
    }

    var list = selectedGroupType == GroupType.OWNER ? groupsJson.groups.ownerOf : groupsJson.groups.memberOf;
    let groupCpy = JSON.parse(JSON.stringify(list[selectedIndex]));
    groupCpy.name = document.getElementById("id_name").value;
    groupCpy.description = document.getElementById("id_description").value;
    request.send(JSON.stringify(groupCpy));
}

function cancelEdits() {
    this.blur();

    var list = selectedGroupType == GroupType.OWNER ? groupsJson.groups.ownerOf : groupsJson.groups.memberOf;
    var group = list[selectedIndex];
    document.getElementById("id_name").value = group.name;
    document.getElementById("id_description").value = group.description;
}

function leaveGroup() {
    this.blur();

}

function disbandGroup() {
    this.blur();
}
