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
    var initialStart = start[0];
    var scheduleTable = document.getElementById("table");
    var hourContainer = scheduleTable.getElementsByClassName("hour-container");
    if (groupNumber != -1 && this.type == ScheduleType.FREE_TIME)
        throw "Tried to add a group time block to a free time schedule.";
    else if (!groupNumber && this.type == ScheduleType.GROUP)
        throw "Tried to add a free time block to a group schedule.";

    if (this.type == ScheduleType.FREE_TIME) {
<<<<<<< HEAD
        var temp = start[0];
        
        while (temp < end[0]) {
          var block = (temp * 7) + day;
          hourContainer[block].style.backgroundColor = GroupColorPallet[0];
          temp++;
=======
        while (start[0] < end[0]) {
            var block = (start[0] * 7) + day;
            hourContainer[block].style.backgroundColor = GroupColorPallet[0];
            start[0]++;
>>>>>>> ade902f29e3079a0959eec6862e3cc4f4256d49f
        }
    }
    
    // reset start value
    start[0] = initialStart;
};

ScheduleManager.prototype.removeTimeBlock = function(day, start, end) {
    var scheduleTable = document.getElementById("table");
    var hourContainer = scheduleTable.getElementsByClassName("hour-container");
<<<<<<< HEAD
    var temp = start[0]
    while (temp < end[0]) {
      console.log("removing block");
      var block = (temp * 7) + day;
      hourContainer[block].style.backgroundColor = "#AFEFAF";
      temp++;
=======
    while (start[0] < end[0]) {
      var block = (start[0] * 7) + day;
      hourContainer[block].style.backgroundColor = "white";
      start[0]++;
>>>>>>> ade902f29e3079a0959eec6862e3cc4f4256d49f
    }
};

ScheduleManager.prototype.clamp = function(minHour, maxHour) {
    // TODO:
};

/** Hides the schedule table, making it invisible. */
ScheduleManager.prototype.hide = function() {
    var scheduleTable = document.getElementById("table");
    scheduleTable.style.visible = "hidden";
};

/** Shows the schedule table. */
ScheduleManager.prototype.show = function() {
    var scheduleTable = document.getElementById("table");
    scheduleTable.style.visible = "visible";
};

/** Checks whether the schedule is visible.
 * @returns true if the schedule is visible.
 */
ScheduleManager.prototype.visible = function() {
    return this.visible;
};

