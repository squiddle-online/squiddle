from enum import IntEnum, unique
from django.http import JsonResponse
from squiddle_app import models


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
        self.json['days'] = list(self.days)
        return JsonResponse(self.json, safe=False)


class Notification:
    def __init__(self, **kwargs):
        self.json = {
            'type': kwargs['type'],
            'sender': kwargs['sender'],
            'receiver': kwargs['receiver'],
            'data': kwargs['data']
        }

    def set_message(self, message):
        self.json['message'] = message

    def get_message(self):
        return self.json['message']

    def set_sender(self, sender):
        self.json['sender'] = sender

    def get_sender(self):
        return self.json['sender']

    def set_receiver(self, receiver):
        self.json['receiver'] = receiver

    def get_receiver(self):
        return self.json['receiver']

    def to_json_response(self):
        assert Notification.__has_valid_json(self.json), 'JSON representation not complete.'
        return JsonResponse(self.json, safe=False)

    @classmethod
    def __has_valid_json(cls, json):
        for v in json.values():
            if isinstance(v, dict):
                if not Notification.__has_valid_json(v):
                    return False
            if not v:
                return False
        return True


class InvitationNotification(Notification):
    def __init__(self, **kwargs):
        kwargs['type'] = models.Notification.Type.INVITATION
        kwargs['data'] = {
            'group_name': kwargs['group_name'],
            'group_id': kwargs['group_id'],
        }
        super().__init__(**kwargs)


class InvitationDeclineNotification(Notification):
    def __init__(self, **kwargs):
        kwargs['type'] = models.Notification.Type.INVITATION_DECLINED
        kwargs['data'] = {
            'sender_name': kwargs['sender_name'],
        }
        super().__init__(**kwargs)


class InvitationAcceptNotification(Notification):
    def __init__(self, **kwargs):
        kwargs['type'] = models.Notification.Type.INVITATION_ACCEPTED
        kwargs['data'] = {
            'sender_name': kwargs['sender_name'],
        }
        super().__init__(**kwargs)




