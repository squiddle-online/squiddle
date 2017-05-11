
var jsonResponse = null;

window.addEventListener("load", function(){
    pullGroupInfo();
});

function pullGroupInfo() {
    var request = new XMLHttpRequest();
    request.open("GET", "/services/groups/schedules/", true);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            jsonResponse = JSON.parse(this.responseText);
            console.log(jsonResponse);
        }
    }
    request.send();
}
