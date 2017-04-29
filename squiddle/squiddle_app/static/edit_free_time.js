var startTimeErrorList = null;
var endTimeErrorList = null;

var freeTime = null;
var freeTimeRequest = null;
var scheduleManager = null;

window.addEventListener("load", function() {
    document.getElementById("add-time-block-button").addEventListener("click", addTimeBlock);

    startTimeErrorList = document.getElementById("start-time-error-list");
    endTimeErrorList = document.getElementById("end-time-error-list");

    scheduleManager = new ScheduleManager(ScheduleType.FREE_TIME);
    freeTime = new WeeklySchedule()

    pullFreeTime();
});

function pullFreeTime() {
    if (freeTimeRequest) freeTimeRequest.abort();
    else freeTimeRequest = new XMLHttpRequest();

    freeTimeRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            freeTime.setJson(this.responseText);
            showFreeTime();
        }
    }

    freeTimeRequest.open("GET", "/services/free-time/", true);
    freeTimeRequest.send();
}

function pushFreeTime() {
    var pushRequest = new XMLHttpRequest();
    pushRequest.open("POST", "/services/free-time/", true);
    pushRequest.setRequestHeader("Content-type", "application/json");
    pushRequest.send(freeTime.toJson());
}

function showFreeTime() {
    if (freeTime.error()) redirect();

    scheduleManager.hide();
    scheduleManager.clamp(freeTime.getFirstHour(), freeTime.getLastHour());

    for (const day of freeTime.days())
        for (const b of freeTime.blocks()[day])
            scheduleManager.addTimeBlock(day, b[0], b[1]);

    scheduleManager.show();
}

/** Reload the page from the server, which will require the user to login if their session has expired */
function redirect() {
    // Force reload from the server.
    window.location.reload(true);
}

function isValidTime(time) {
    hour = time[0]
    minute = time[1]
    return hour >= 0 && hour <= 23 &&
           minute >= 0 && minute <= 59
}

function addTimeBlock() {
    this.blur();

    // If the request wasn't sent yet or it failed, try again.
    if (!freeTimeRequest || (freeTimeRequest.readyState == 4 && freeTimeRequest.status != 200))
        pullFreeTime();

    // Validate the input.

    var rawStartTime = document.getElementById("start-time").value;
    var rawEndTime = document.getElementById("end-time").value;
    var timeRegex = /(\d+):(\d+)/;

    var startMatch = rawStartTime.match(timeRegex);
    var endMatch = rawEndTime.match(timeRegex);

    // Show errors for invalid input and exit early if necessary.

    console.log(startMatch.slice(1))
    if (!startMatch || !isValidTime(startMatch.slice(1))) {
        startTimeErrorList.innerHTML = "<li class=\"error\">Invalid Start Time</li>";
        return;
    }
    else
        startTimeErrorList.innerHtml = "";

    if (!endMatch || !isValidTime(endMatch.slice(1))) {
        endTimeErrorList.innerHTML = "<li class=\"error\">Invalid End Time</li>";
        return;
    }
    else {
        endTimeErrorList.innerHTML = "";
    }

    // Check to see if the time block conflicts with the current schedule.
    // TODO: Get the selected day.

}

function removeTimeBlock() {
    this.blur();
}
