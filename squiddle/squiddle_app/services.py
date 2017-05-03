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
        return rest_data.InvitationNotification(sender='test sender', receiver='test receiver',
                                                group_id=0, group_name='test group name').to_json_response()
    return HttpResponse()


@csrf_exempt
def users(request):
    if request.method == 'GET':
        return HttpResponse()


url_patterns = [
    url(r'^free-time/$', free_time, name='free_time'),
    url(r'^notifications/$', notifications, name='notifications'),
    url(r'^users/$', users, name='users')
]
