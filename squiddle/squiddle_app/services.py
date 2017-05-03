from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from squiddle_app import rest_data
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


url_patterns = [
    url(r'^free-time/$', free_time, name='free_time')
]
