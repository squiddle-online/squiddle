from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from squiddle_app import rest_data
from squiddle_app import models
import json


# @Hack
@csrf_exempt
def free_time(request):
    free_time_obj = request.user.member.free_time
    if request.method == 'GET':
        return rest_data.WeeklySchedule(free_time_obj.json).to_json_response()
    else:
        free_time_obj.json = json.loads(request.body.decode("utf-8"))
        free_time_obj.save()
        return HttpResponse()


@csrf_exempt
def notifications(request):
    if request.method == 'GET':
        notification_list = rest_data.NotificationList()
        notification_list.add(rest_data.InvitationNotification(sender='test sender', receiver='test receiver',
                                                               group_id=0, group_name='test group name'))
        notification_list.add(rest_data.InvitationDeclineNotification(sender='test sender', receiver='test receiver',
                                                                      group_id=0, group_name='test group name'))
        notification_list.add(rest_data.InvitationAcceptNotification(sender='test sender', receiver='test receiver',
                                                                     group_id=0, group_name='test group name'))
        return notification_list.to_json_response()
    else:
        return HttpResponse()


@csrf_exempt
def remove_notification(request):
    return HttpResponse()


@csrf_exempt
def users(request):
    if request.method == 'GET':
        return HttpResponse()


url_patterns = [
    url(r'^free-time/$', free_time, name='free_time'),
    url(r'^notifications/$', notifications, name='notifications'),
    url(r'^notifications/remove/$', remove_notification, name='remove_notification'),
    url(r'^users/$', users, name='users')
]
