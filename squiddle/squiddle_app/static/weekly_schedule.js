const WeekDay = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
};

var TimeBlock = function(start, end) {
    this.isNull = !start || !end;
    this.start = start ? start : [0, 0];
    this.end = end ? end : [0, 0];
};

TimeBlock.prototype.set = function(start, end) {
    this.isNull = !start || !end;
    this.start = start ? start : [0, 0];
    this.end = end ? end : [0, 0];
};

TimeBlock.prototype.clear = function() {
    this.isNull = true;
    this.start = null;
    this.end = null;
};

TimeBlock.prototype.assign = function(other) {
    this.isNull = other.isNull;
    this.start = other.start;
    this.end = other.end;
};

TimeBlock.prototype.isNull = function() {
    return this.isNull;
};

TimeBlock.prototype.isValid = function() {
    if (this.isNull) return false;

    var startHour = this.start[0];
    var startMinute = this.start[1];
    var endHour = this.end[0];
    var endMinute = this.end[1];

    // Check for valid looking times.

    if (startHour < 0 || startHour > 23 ||
        startMinute < 0 || startMinute > 59) {
        return false;
    }

    if (endHour < 0 || endHour > 23 ||
        endMinute < 0 || endMinute > 59) {
        return false;
    }

    // Check that the block isn't zero minutes long and the start time doesn't
    // come after the end time.

    var convertedStartTime = startHour*60 + startMinute;
    var convertedEndTime = endHour*60 + endMinute;

    if (convertedStartTime >= convertedEndTime) return false;

    return true;
};

TimeBlock.prototype.startsBefore = function(other) {
    if (this.isNull || other.isNull)
        throw "Called startsBefore() with one or more null TimeBlocks.";

    return this.start[0]*60 + this.start[1] <
           other.start[0]*60 + other.start[1];
};

TimeBlock.prototype.startsAfter = function(other) {
    if (this.isNull || other.isNull)
        throw "Called startsAfter() on one or more null TimeBlocks.";

    return this.start[0]*60 + this.start[1] >
           other.start[0]*60 + other.start[1];
};

TimeBlock.prototype.endsBefore = function(other) {
    if (this.isNull || other.isNull)
        throw "Called endsBefore() with one or more null TimeBlocks.";

    return this.end[0]*60 + this.end[1] <
           other.end[0]*60 + other.end[1];
};

TimeBlock.prototype.endsAfter = function(other) {
    if (this.isNull || other.isNull)
        throw "Called endsAfter() on one or more null TimeBlocks.";

    return this.end[0]*60 + this.end[1] >
           other.end[0]*60 + other.end[1];
};

TimeBlock.prototype.overlaps = function(block) {
    if (this.isNull)
        throw "Called overlaps() on a null TimeBlock";

    return this.overlapsRaw(block.start, block.end)
};

TimeBlock.prototype.overlapsRaw = function(start, end) {
    var convertedFirstStartTime = this.start[0]*60 + this.start[1];
    var convertedFirstEndTime = this.end[0]*60 + this.end[1];

    var convertedSecondStartTime = start[0]*60 + start[1];
    var convertedSecondEndTime = end[0]*60 + end[1];

    return !(convertedFirstEndTime < convertedSecondStartTime ||
           convertedSecondEndTime < convertedFirstStartTime);
};

TimeBlock.prototype.equals = function(other) {
    if (this.isNull || other.isNull) {
        throw "Comparison of one or more null TimeBlocks.";
    }

    return this.start[0] == other.start[0] &&
           this.end[0] == other.end[0] &&
           this.start[1] == other.start[1] &&
           this.end[1] == other.end[1];
};

TimeBlock.prototype.setStart = function(start) {
    this.start = start;
};

TimeBlock.prototype.setEnd = function(end) {
    this.end = end;
};

TimeBlock.prototype.getStart = function() {
    return this.start;
};

TimeBlock.prototype.getEnd = function() {
    return this.end;
};

TimeBlock.prototype.toString = function() {
    return "" + this.start[0] + ":" + this.start[1] + "-" +
           this.end[0] + ":" + this.end[1];
};

// WeeklySchedule

var WeeklySchedule = function(json) {
    this.repr = json ? JSON.parse(json) : null;
    this.firstHour = 0;
    this.lastHour = 23;
    this.detail.constrainHours();
};

WeeklySchedule.prototype.setJson = function(json) {
    this.repr = json ? JSON.parse(json) : null;
    this.firstHour = 0;
    this.lastHour = 23;
    this.detail.constrainHours();
};

WeeklySchedule.prototype.detail = {};
WeeklySchedule.prototype.detail.constrainHours = function() {
    // Find the earliest and latest needed hour (useful for display).
    // This assumes the blocks are sorted and don't overlap.
    if (this.repr) {
        for (const day of this.repr.days) {
            var blocks = this.repr.blocks[day];
            var candidateFirstHour = blocks[0][0][0];
            var candidateLastHour = blocks[blocks.length-1][1][0];

            if (candidateFirstHour > this.firstHour)
                this.firstHour = candidateFirstHour;

            if (candidateLastHour < this.lastHour)
                this.lastHour = candidateLastHour;
        }
    }
};

WeeklySchedule.prototype.addTimeBlock = function(day, block) {
    var blocks_for_day = this.repr.blocks[day];

    if (blocks_for_day.length == 0) {
        blocks_for_day.push([block.getStart(), block.getEnd()]);
        return true;
    }

    for (const b of blocks_for_day)
        if (block.overlapsRaw(b[0], b[1])) return false;

    // @Slow. We could just manually insert it where it needs to go.
    blocks_for_day.push([block.getStart(), block.getEnd()]);
    blocks_for_day.sort(function (b1, b2) {
        let firstStart = b1[0][0]*60 + b1[0][1];
        let firstEnd = b1[1][0]*60 + b1[1][1];
        let secondStart = b2[0][0]*60 + b2[0][1];
        let secondEnd = b2[1][0]*60 + b2[1][1];

        if (firstStart < secondStart) return -1;
        else if (firstStart > secondStart) return 1;
        else return 0; // equal as long as no overlapping block was inserted.
    });

    return true;
};

WeeklySchedule.prototype.removeTimeBlock = function(day, index) {
    this.repr.blocks[day].splice(index, 1);
};

WeeklySchedule.prototype.assign = function(schedule) {
    this.repr = schedule.repr;
};

WeeklySchedule.prototype.error = function() {
    return this.repr.error;
};

WeeklySchedule.prototype.toJson = function() {
    return JSON.stringify(this.repr);
};

WeeklySchedule.prototype.days = function() {
    return this.repr.days;
};

WeeklySchedule.prototype.blocks = function() {
    return this.repr.blocks;
};

WeeklySchedule.prototype.getFirstHour = function() {
    return this.firstHour;
};

WeeklySchedule.prototype.getLastHour = function() {
    return this.lastHour;
};
