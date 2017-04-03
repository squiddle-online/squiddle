from django.contrib import admin
from .models import *

# Register your models here.


@admin.register(TimeBlock)
class TimeBlockAdmin(admin.ModelAdmin):
    pass


@admin.register(WeeklySchedule)
class WeeklyScheduleAdmin(admin.ModelAdmin):
    pass


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    exclude = ['free_time']


@admin.register(MemberGroup)
class MemberGroupAdmin(admin.ModelAdmin):
    exclude = ['schedule']

