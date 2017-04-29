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
    // TODO: add rgb values or whatever you need here.
];

var ScheduleManager = function(type) {
    // TODO: grab the schedule table by id and setup anything else.

    this.type = type;

    // TODO: the table needs to be invisible by default, so the user doesn't
    // see anything until their schedule is populated.
    this.visible = false;
};

ScheduleManager.prototype.type = function() {
    return this.type;
};

ScheduleManager.prototype.addTimeBlock = function(day, start, end, groupNumber = -1) {
    if (groupNumber != -1 && this.type == ScheduleType.FREE_TIME)
        throw "Tried to add a group time block to a free time schedule.";
    else if (!groupNumber && this.type == ScheduleType.GROUP)
        throw "Tried to add a free time block to a group schedule.";

    if (this.type == ScheduleType.FREE_TIME) {
        // TODO: Quick and easy; add a free time styled block.
        return;
    }

    // TODO: Add a group block using groupNumber to lookup colors in the GroupColorPallet or whatever works.
};

ScheduleManager.prototype.removeTimeBlock = function(day, start, end) {
    // TODO:
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

