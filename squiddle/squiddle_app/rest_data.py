from enum import IntEnum, unique
from django.http import JsonResponse
import copy


@unique
class Day(IntEnum):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6


class WeeklySchedule:
    def __init__(self, json=None):
        if json:
            self.json = json
            self.days = set()
            return

        self.json = dict(
            blocks={
                Day.MONDAY: [],
                Day.TUESDAY: [],
                Day.WEDNESDAY: [],
                Day.THURSDAY: [],
                Day.FRIDAY: [],
                Day.SATURDAY: [],
                Day.SUNDAY: [],
            },
            days=[],
        )
        self.days = set()

    def json_dict(self):
        self.json['days'] = list(self.days)
        return self.json

    def add_block(self, day, start, end):
        # @Slow: no need for the sorting business, but whatever.
        blocks_for_day = self.json['blocks'][day]

        new_block = (start, end)  # Needed for comparison later.
        blocks_for_day.append(new_block)
        # Sort blocks based on (start hour)*60 + start minute.
        blocks_for_day.sort(key=lambda block: block[0][0]*60 + block[0][1])

        new_block_index = 0
        for i in range(0, len(blocks_for_day)-2):
            # Keep track if the index where we find the new block in case
            # we need to remove it.
            current_block = blocks_for_day[i]
            if new_block == current_block:
                new_block_index = i

            # Compare end hour(to minutes) + end minute of current with start hour(to minutes) +
            # start minute of the next block to check for overlap.
            # Each block => ((start hour, start minute), (end hour, end minute))

            temp_time = current_block[1]  # current end time
            cur_end = temp_time[0]*60 + temp_time[1]  # end hour(to minutes) + end minute

            temp_time = blocks_for_day[i+1][0]  # next start time
            next_start = temp_time[0]*60 + temp_time[1]  # start hour(to minutes) + start minute

            if cur_end > next_start:
                if new_block_index == i:
                    blocks_for_day.pop(i)
                else:
                    blocks_for_day.pop(i+1)
                return False

        self.days.add(day)
        return True

    def to_json_response(self):
        print(self.json)
        self.json['days'] = list(self.days)
        return JsonResponse(self.json, safe=False)
