from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from timezone_field import TimeZoneField
from jsonfield import JSONField
from squiddle_app import rest_data
import json


class WeeklySchedule(models.Model):
    class Parent:
        MEMBER = 0
        MEMBER_GROUP = 1

        CHOICES = (
            (MEMBER, 'MEMBER'),
            (MEMBER_GROUP, 'GROUP'),
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
    groups = models.ManyToManyField('MemberGroup', blank=True)
    # Not really nullable and will be handled through receivers
    free_time = models.ForeignKey(WeeklySchedule, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.username


class MemberGroup(models.Model):
    name = models.CharField(max_length=32)
    owner = models.ForeignKey(Member, on_delete=models.CASCADE)
    description = models.CharField(max_length=256)
    # Not really nullable and will be handled through receivers
    schedule = models.ForeignKey(WeeklySchedule, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class Notification(models.Model):
    pass


# Signal Receivers

# Create Members for User objects

@receiver(post_save, sender=User)
def create_member(sender, instance, created, **kwargs):
    if created:
        Member.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_member(sender, instance, **kwargs):
    instance.member.save()


# Create Empty Weekly Schedule Objects for MemberGroups and Members


# Members


@receiver(post_save, sender=Member)
def create_weekly_schedule_for_member(sender, instance, created, **kwargs):
    if created:
        schedule = WeeklySchedule.objects.create(parent_type=WeeklySchedule.Parent.MEMBER, parent_member=instance)
        instance.free_time = schedule
        instance.save()


@receiver(post_save, sender=Member)
def save_weekly_schedule_for_member(sender, instance, **kwargs):
    instance.free_time.save()


# MemberGroups


@receiver(post_save, sender=MemberGroup, dispatch_uid='create_weekly_schedule_for_group')
def create_weekly_schedule_for_group(sender, instance, created, **kwargs):
    if created:
        schedule = WeeklySchedule.objects.create(parent_type=WeeklySchedule.Parent.MEMBER_GROUP, parent_group=instance)
        instance.schedule = schedule
        instance.save()


@receiver(post_save, sender=MemberGroup, dispatch_uid='save_weekly_schedule_for_group')
def save_weekly_schedule_for_group(sender, instance, created, **kwargs):
    instance.schedule.save()

