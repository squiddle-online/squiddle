var startTimeErrorList = null;
var endTimeErrorList = null;

window.addEventListener("load", function() {
    document.getElementById("add-time-block-button").addEventListener("click", addTimeBlock);

    startTimeErrorList = document.getElementById("start-time-error-list");
    endTimeErrorList = document.getElementById("end-time-error-list");
});

function addTimeBlock() {
    this.blur();

    var rawStartTime = document.getElementById("start-time").value;
    var rawEndTime = document.getElementById("end-time").value;
    var timeRegex = /(\d):(\d)/;

    var startMatch = rawStartTime.match(timeRegex);
    var endMatch = rawEndTime.match(timeRegex);

    console.log("Got here.");

    if (!startMatch)
        startTimeErrorList.innerHTML = "<li class=\"error\">Invalid Start Time</li>";
    else
        startTimeErrorList.innerHtml = "";

    if (!endMatch)
        endTimeErrorList.innerHTML = "<li class=\"error\">Invalid End Time</li>";
    else
        endTimeErrorList.innerHTML = "";

}
