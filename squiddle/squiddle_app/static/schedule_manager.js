
const WeekDay = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
};

const GroupColorPallet = [
    // TODO: add rgb values here.
];

var TimeBlock = function(type, start, end) {
    this.type = type;
    this.valid = !start || !end;
    this.start = start ? start : [0, 0];
    this.end = end ? end : [0, 0];
};

TimeBlock.prototype.overlaps = function(block) {
    return false;
};

TimeBlock.prototype.overlaps = function(start, end) {
    return false;
};

const ScheduleVisibilityState = {
    SHOWN: 0,
    HIDDEN: 1,
};

const ScheduleType = {
    FREE_TIME: 0,
    GROUP: 1,
};

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

ScheduleManager.prototype.addTimeBlock = function(day, block) {
};

ScheduleManager.prototype.removeTimeBlock = function(day, block) {
};

ScheduleManager.prototype.clamp = function(minHour, maxHour) {
};

/** Hides the schedule table, making it invisible. */
ScheduleManager.prototype.hide = function() {
};

/** Shows the schedule table. */
ScheduleManager.prototype.show = function() {
};

/** Shows the schedule table. */
ScheduleManager.prototype.visible = function() {
    return false;
};

