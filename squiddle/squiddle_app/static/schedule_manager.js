// ScheduleManager

const ScheduleVisibilityState = {
    SHOWN: 0,
    HIDDEN: 1,
};

const ScheduleType = {
    FREE_TIME: 0,
    GROUP: 1,
};

const GroupColorPallet = [
    "lightblue", "orange", "blue", "red"
];

var ScheduleManager = function(type) {
    var scheduleTable = document.getElementById("table");
    var hourContainer = scheduleTable.getElementsByClassName("hour-container");
    this.type = type;
    this.visible = false;
};

ScheduleManager.prototype.type = function() {
    return this.type;
}

ScheduleManager.prototype.addTimeBlock = function(day, start, end, groupNumber = -1) {
    var scheduleTable = document.getElementById("table");
    var hourContainers = scheduleTable.getElementsByClassName("hour-container");
    if (groupNumber != -1 && this.type == ScheduleType.FREE_TIME)
        throw "Tried to add a group time block to a free time schedule.";
    else if (!groupNumber && this.type == ScheduleType.GROUP)
        throw "Tried to add a free time block to a group schedule.";

    if (this.type == ScheduleType.FREE_TIME) {
        while (start < end) {
            var block = (start * 7 - 1) + day;
            hourContainers[block].style.backgroundColor = GroupColorPallet[0];
            start++;
        }
    }
};

ScheduleManager.prototype.removeTimeBlock = function(day, start, end) {
    var scheduleTable = document.getElementById("table");
    var hourContainer = scheduleTable.getElementsByClassName("hour-container");
    while (start < end) {
      var block = (start * 7 - 1) + day;
      hourContainer[block].style.backgroundColor = "#AFEFAF";
      start++;
    }
};

ScheduleManager.prototype.clamp = function(minHour, maxHour) {
    // TODO:
};

/** Hides the schedule table, making it invisible. */
ScheduleManager.prototype.hide = function() {
    // TODO:
};

/** Shows the schedule table. */
ScheduleManager.prototype.show = function() {
    // TODO:
};

/** Checks whether the schedule is visible.
 * @returns true if the schedule is visible.
 */
ScheduleManager.prototype.visible = function() {
    return this.visible;
};

