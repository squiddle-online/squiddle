
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
});

function pullGroupInfo() {
    var request = new XMLHttpRequest();
    request.open("GET", "/services/groups/", true);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            jsonResponse = JSON.parse(this.responseText);
            console.log(jsonResponse);
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
    for (let g of jsonResponse.groups.ownerOf) {
        let entry = document.createElement("div");
        entry.setAttribute("class", "group-entry owned-group-entry");

        let text = document.createElement("p");
        text.setAttribute("class", "entry text");
        text.innerHTML = g.name;
        text.style = textEntryStyle;

        entry.appendChild(text);
        ownedGroupsListElem.appendChild(entry);
    }
}

function populateMemberOf() {
    for (let g of jsonResponse.groups.memberOf) {
        let entry = document.createElement("div");
        entry.setAttribute("class", "group-entry member-of-group-entry");

        let text = document.createElement("p");
        text.setAttribute("class", "entry text");
        text.innerHTML = g.name;
        text.style = textEntryStyle;

        entry.appendChild(text);
        memberOfGroupsListElem.appendChild(entry);
    }
}
