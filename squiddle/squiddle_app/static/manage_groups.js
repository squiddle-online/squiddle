
const GroupType = {
    OWNER: 0,
    MEMBER: 1,
};

var jsonResponse = null;
var selectedGroupType = null;
var selectedElement = null;
var selectedIndex = null;
var ownedGroupsListElem = null;
var memberOfGroupsListElem = null;

window.addEventListener("load", function(){
    pullGroupInfo();

    ownedGroupsListElem = document.getElementById("owned-groups-list");
    memberOfGroupsListElem = document.getElementById("member-of-groups-list");

    document.getElementById("leave-group-button").addEventListener("click", leaveGroup);
    document.getElementById("disband-group-button").addEventListener("click", disbandGroup);
});

function pullGroupInfo() {
    var request = new XMLHttpRequest();
    request.open("GET", "/services/groups/", true);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            jsonResponse = JSON.parse(this.responseText);
            populateGroupLists();
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
    for (let i = 0; i < jsonResponse.groups.ownerOf.length; i++) {
        let g = jsonResponse.groups.ownerOf[i];

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
    for (let i = 0; i < jsonResponse.groups.memberOf.length; i++) {
        let g = jsonResponse.groups.memberOf[i];

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

    var group = jsonResponse.groups.ownerOf[selectedIndex];
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
    for (let options of document.getElementById("group-options").children) {
        options.classList.add("hidden");
    }
}

function leaveGroup() {
}

function disbandGroup() {
}
