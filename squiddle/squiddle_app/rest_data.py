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
            # @Hack to undo the conversion to strings
            self.json = json
            blocks = self.json['blocks']
            blocks[Day.MONDAY.value] = blocks['0']
            blocks[Day.TUESDAY.value] = blocks['1']
            blocks[Day.WEDNESDAY.value] = blocks['2']
            blocks[Day.THURSDAY.value] = blocks['3']
            blocks[Day.FRIDAY.value] = blocks['4']
            blocks[Day.SATURDAY.value] = blocks['5']
            blocks[Day.SUNDAY.value] = blocks['6']

            del blocks['0']
            del blocks['1']
            del blocks['2']
            del blocks['3']
            del blocks['4']
            del blocks['5']
            del blocks['6']

            self.days = set(json['days'])
            return

        self.json = dict(
            blocks={
                Day.MONDAY.value : [],
                Day.TUESDAY.value: [],
                Day.WEDNESDAY.value: [],
                Day.THURSDAY.value: [],
                Day.FRIDAY.value: [],
                Day.SATURDAY.value: [],
                Day.SUNDAY.value: [],
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

        if isinstance(day, Day):
            self.days.add(day.value)
        else:
            self.days.add(day)

        return True

    def to_json_response(self):
        self.json['days'] = list(self.days)
        return JsonResponse(self.json, safe=False)


def is_valid_json_dict(json_dict):
    for v in json_dict.values():
        if isinstance(v, dict):
            if not is_valid_json_dict(v):
                return False
        if v is None:
            return False
    return True


class Notification:
    def __init__(self, **kwargs):
        self.json = {
            'type': kwargs['type'],
            'id': kwargs['id'],
            'senderId': kwargs['sender_id'],
            'senderName': kwargs['sender_name'],
            'receiverName': kwargs['receiver_name'],
            'receiverId': kwargs['receiver_id'],
            'data': kwargs['data']
        }

    def set_sender_name(self, sender_name):
        self.json['sender_name'] = sender_name

    def set_sender_id(self, sender_id):
        self.json['sender_id'] = sender_id

    def get_sender_name(self):
        return self.json['sender_name']

    def get_sender_id(self):
        return self.json['sender_id']

    def set_receiver_name(self, receiver_name):
        self.json['receiver_name'] = receiver_name

    def set_receiver_id(self, receiver_id):
        self.json['receiver_id'] = receiver_id

    def get_receiver_name(self):
        return self.json['receiver_name']

    def get_receiver_id(self):
        return self.json['receiver_id']

    def json_dict(self):
        assert is_valid_json_dict(self.json), 'JSON representation not complete.'
        return self.json

    def to_model(self):
        assert is_valid_json_dict(self.json), 'JSON representation not complete.'
        return models.Notification(sender=self.json['sender_id'], receiver=self.json['receiver_id'],
                                   type=self.json['type'], data=self.json['data'])


class InvitationNotification(Notification):
    def __init__(self, **kwargs):
        kwargs['type'] = models.Notification.Type.INVITATION
        kwargs['data'] = {
            'groupName': kwargs['group_name'],
            'groupId': kwargs['group_id'],
        }
        super().__init__(**kwargs)


class InvitationDeclineNotification(Notification):
    def __init__(self, **kwargs):
        kwargs['type'] = models.Notification.Type.INVITATION_DECLINED
        kwargs['data'] = {}
        super().__init__(**kwargs)


class InvitationAcceptNotification(Notification):
    def __init__(self, **kwargs):
        kwargs['type'] = models.Notification.Type.INVITATION_ACCEPTED
        kwargs['data'] = {}
        super().__init__(**kwargs)


class NotificationList:
    def __init__(self):
        self.json = {
            'notificationList': []
        }

        self.list = self.json['notificationList']

    def add(self, notification):
        self.list.append(notification.json_dict())

    def to_json_response(self):
        return JsonResponse(self.json, safe=False)


class Member:
    def __init__(self, **kwargs):
        self.json = {
            'name': kwargs['name'],
            'id': kwargs['id'],
            'tz': kwargs['tz'],
        }

    def json_dict(self):
        assert is_valid_json_dict(self.json), 'JSON representation incomplete.'
        return self.json

    def to_model(self):
        assert is_valid_json_dict(self.json), 'JSON representation incomplete.'
        return models.User.objects.get(username=self.json['name']).member


class Group:
    def __init__(self, **kwargs):
        self.json = {
            'name': kwargs['name'],
            'id': kwargs['id'],
            'owner': kwargs['owner'],
            'members': kwargs['members'],
        }

        self.members = self.json['members']

    def get_name(self):
        return self.json['name']

    def set_name(self, name):
        self.json['name'] = name

    def get_id(self):
        return self.json['id']

    def set_id(self, pk):
        self.json['id'] = pk

    def get_owner(self):
        return self.json['owner']

    def set_owner(self, owner):
        self.json['owner'] = owner

    def get_members(self):
        return self.members

    def add_member(self, member):
        self.members.append(member.json_dict())

    def json_dict(self):
        assert is_valid_json_dict(self.json), 'JSON representation is incomplete'
        return self.json

    def to_model(self):
        assert is_valid_json_dict(self.json), 'JSON representation is incomplete'
        return models.MemberGroup.objects.get(pk=self.json['id'], name=self.json['name'],
                                              owner=models.User.objects.get(username=self.json['owner']).member)


class GroupList:
    def __init__(self):
        self.json = {
            'groups': {
                'ownerOf': [],
                'memberOf': [],
            }
        }

        self.owner_of = self.json['groups']['ownerOf']
        self.member_of = self.json['groups']['memberOf']

    def add_owner_of(self, group):
        self.owner_of.append(group.json_dict())

    def add_member_of(self, group):
        self.member_of.append(group.json_dict())

    def to_json_response(self):
        return JsonResponse(self.json, safe=False)


class GroupSchedules:
    def __init__(self):
        self.json = {
            'groups': []
        }

    def add(self, name, schedule):
        self.json['groups'].append({'name': name, 'schedule': schedule.json_dict()})

    def json_dict(self):
        assert is_valid_json_dict(self.json), 'JSON representation in incomplete'
        return self.json

    def to_json_response(self):
        return JsonResponse(self.json, safe=False)

