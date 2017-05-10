

window.addEventListener("load", function(){
    pullGroupInfo();
});

function pullGroupInfo() {
    var request = new XMLHttpRequest();
    request.open("GET", "/services/groups/owned/", true);
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

        }
    }
    request.send();
}
