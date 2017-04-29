var startTimeErrorList = null;
var endTimeErrorList = null;

var freeTime = null;
var freeTimeRequest = null;
var scheduleManager = null;

window.addEventListener("load", function() {
    document.getElementById("add-time-block-button").addEventListener("click", addTimeBlock);
    document.getElementById("day-selector").addEventListener("change", dayChanged);

    startTimeErrorList = document.getElementById("start-time-error-list");
    endTimeErrorList = document.getElementById("end-time-error-list");

    scheduleManager = new ScheduleManager(ScheduleType.FREE_TIME);
    freeTime = new WeeklySchedule();

    pullFreeTime();
});

// Event Listeners

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

    var wasError = false;
    if (startMatch && isValidTime(startMatch.slice(1))) {
        startTimeErrorList.innerHTML = "";
    }
    else {
        startTimeErrorList.innerHTML = "<li class=\"error\">Invalid Start Time</li>";
        wasError = true;
    }

    if (endMatch && isValidTime(endMatch.slice(1))) {
        endTimeErrorList.innerHTML = "";
    }
    else {
        endTimeErrorList.innerHTML = "<li class=\"error\">Invalid End Time</li>";
        wasError = true;
    }

    if (wasError) return;

    // Check to see if the time block conflicts with the current schedule.
    // TODO: Get the selected day.

}

function removeTimeBlock(day, index) {

}

function dayChanged() {
    populateBlockList(this.selectedIndex);
}

// Helpers

/** Pulls the free time from the server and calls showFreeTime().
 * @note If the session is invalid, the user will be redirected to the home page.
 */
function pullFreeTime() {
    if (freeTimeRequest) freeTimeRequest.abort();
    else freeTimeRequest = new XMLHttpRequest();

    freeTimeRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            freeTime.setJson(this.responseText);
            showFreeTime();
            populateBlockList(WeekDay.MONDAY);
        }
    }

    freeTimeRequest.open("GET", "/services/free-time/", true);
    freeTimeRequest.send();
}

/** Pushes the new free time to the server to be saved. */
function pushFreeTime() {
    var pushRequest = new XMLHttpRequest();
    pushRequest.open("POST", "/services/free-time/", true);
    pushRequest.setRequestHeader("Content-type", "application/json");
    pushRequest.send(freeTime.toJson());
}

/* Adds free time blocks to the schedule view. */
function showFreeTime() {
    if (freeTime.error()) redirect();

    scheduleManager.hide();
    scheduleManager.clamp(freeTime.getFirstHour(), freeTime.getLastHour());

    for (const day of freeTime.days())
        for (const b of freeTime.blocks()[day])
            scheduleManager.addTimeBlock(day, b[0], b[1]);

    scheduleManager.show();
}

/** Fill the block list with the time blocks from a given day.
 * @param day The day to display the blocks from.
 */
function populateBlockList(day) {
    var list = document.getElementById("block-list");
    list.innerHTML = "";

    for (const b of freeTime.blocks()[day]) {
        var entry = document.createElement("div");
        entry.setAttribute("class", "block-entry");

        var label = document.createElement("p");
        label.setAttribute("class", "block-label");

        var startMinuteString = ('00' + b[0][1]).slice(-2);
        var endMinuteString = ('00' + b[1][1]).slice(-2);
        label.innerHTML = b[0][0] + ":" + startMinuteString + "-" + b[1][0] + ":" + endMinuteString;

        var button = document.createElement("button");
        button.setAttribute("class", "close");
        button.setAttribute("aria-label", "Close");

        var span = document.createElement("span");
        span.setAttribute("aria-hidden", "true");

        span.innerHTML = "&times;";
        button.appendChild(span);
        entry.appendChild(label);
        entry.appendChild(button);
        list.appendChild(entry);
    }
}

/** Reload the page from the server, which will require the user to login if their session has expired */
function redirect() {
    // Force reload from the server.
    window.location.reload(true);
}

function isValidTime(time) {
    hour = time[0];
    minute = time[1];
    return hour >= 0 && hour <= 23 &&
           minute >= 0 && minute <= 59;
}

