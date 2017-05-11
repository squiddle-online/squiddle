from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django import dispatch
from django.core import exceptions
from timezone_field import TimeZoneField
from jsonfield import JSONField
from squiddle_app import rest_data


class WeeklySchedule(models.Model):
    class Parent:
        MEMBER = 0
        MEMBER_GROUP = 1

        CHOICES = (
            (MEMBER, 'Member'),
            (MEMBER_GROUP, 'Group'),
        )

    # Model Fields
    parent_member = models.ForeignKey('Member', on_delete=models.CASCADE, null=True, blank=True)
    parent_group = models.ForeignKey('MemberGroup', on_delete=models.CASCADE, null=True, blank=True)
    parent_type = models.PositiveSmallIntegerField(choices=Parent.CHOICES)
    json = JSONField(default=rest_data.WeeklySchedule().json_dict())

    def __str__(self):
        if self.parent_type == WeeklySchedule.Parent.MEMBER:
            return 'Free Time of: %s' % self.parent_member.user.username
        else:
            return 'Weekly Schedule of: %s' % self.parent_group.name


class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    timezone = TimeZoneField()
    groups = models.ManyToManyField('MemberGroup', related_name='members', blank=True)
    # Not really nullable and will be handled through receivers
    free_time = models.ForeignKey(WeeklySchedule, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.username

    def to_rest_data(self):
        return rest_data.Member(name=self.user.username, id=self.pk, tz=str(self.timezone))


class MemberGroup(models.Model):
    name = models.CharField(max_length=32)
    owner = models.ForeignKey(Member, on_delete=models.CASCADE)
    description = models.CharField(max_length=256)
    # Not really nullable and will be handled through receivers
    schedule = models.ForeignKey(WeeklySchedule, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

    def to_rest_data(self):
        return rest_data.Group(name=self.name, id=self.pk, owner=self.owner.user.username,
                               description=self.description,
                               members=[m.to_rest_data().json_dict() for m in self.members.all()])


class Notification(models.Model):
    class Type:
        INVITATION = 0
        INVITATION_ACCEPTED = 1
        INVITATION_DECLINED = 2

        CHOICES = (
            (INVITATION, 'Invitation'),
            (INVITATION_ACCEPTED, 'Invitation Accepted'),
            (INVITATION_DECLINED, 'Invitation Declined'),
        )

    sender = models.ForeignKey(Member, related_name='sent_notifications', on_delete=models.SET_NULL, null=True)
    receiver = models.ForeignKey(Member, related_name='received_notifications', on_delete=models.CASCADE)
    type = models.PositiveSmallIntegerField(choices=Type.CHOICES)
    data = JSONField()

    @classmethod
    def create_invitation(cls, group, member):
        return Notification(sender=group.owner, receiver=member,
                            type=Notification.Type.INVITATION,
                            data={'group_name': group.name, 'group_id': group.pk})

    @classmethod
    def create_invitation_accepted(cls, sender, receiver):
        return Notification(sender=sender, receiver=receiver,
                            type=Notification.Type.INVITATION_ACCEPTED,
                            data={})

    @classmethod
    def create_invitation_declined(cls, sender, receiver):
        return Notification(sender=sender, receiver=receiver,
                            type=Notification.Type.INVITATION_DECLINED,
                            data={})

    def to_rest_data(self):
        kwargs = {'id': self.pk, 'sender_name': self.sender.user.username, 'sender_id': self.sender.pk,
                  'receiver_name': self.receiver.user.username, 'receiver_id': self.receiver.pk}

        if self.type == Notification.Type.INVITATION:
            kwargs['group_name'] = self.data['group_name']
            kwargs['group_id'] = self.data['group_id']
            return rest_data.InvitationNotification(**kwargs)
        elif self.type == Notification.Type.INVITATION_ACCEPTED:
            return rest_data.InvitationAcceptNotification(**kwargs)
        else:
            return rest_data.InvitationDeclineNotification(**kwargs)


# Signal Receivers

# Create Members for User objects

@dispatch.receiver(post_save, sender=User)
def create_member(sender, instance, created, **kwargs):
    if created:
        Member.objects.create(user=instance)


@dispatch.receiver(post_save, sender=User)
def save_member(sender, instance, **kwargs):
    instance.member.save()


# Create Empty Weekly Schedule Objects for MemberGroups and Members


# Members


@dispatch.receiver(post_save, sender=Member)
def create_weekly_schedule_for_member(sender, instance, created, **kwargs):
    if created:
        schedule = WeeklySchedule.objects.create(parent_type=WeeklySchedule.Parent.MEMBER, parent_member=instance)
        instance.free_time = schedule
        instance.save()


@dispatch.receiver(post_save, sender=Member)
def save_weekly_schedule_for_member(sender, instance, **kwargs):
    instance.free_time.save()


# MemberGroups


@dispatch.receiver(post_save, sender=MemberGroup, dispatch_uid='create_weekly_schedule_for_group')
def create_weekly_schedule_for_group(sender, instance, created, **kwargs):
    if created:
        schedule = WeeklySchedule.objects.create(parent_type=WeeklySchedule.Parent.MEMBER_GROUP, parent_group=instance)
        instance.schedule = schedule
        instance.save()


@dispatch.receiver(post_save, sender=MemberGroup, dispatch_uid='save_weekly_schedule_for_group')
def save_weekly_schedule_for_group(sender, instance, created, **kwargs):
    instance.schedule.save()

