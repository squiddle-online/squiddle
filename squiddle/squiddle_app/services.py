from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from squiddle_app.rest_data import *


@csrf_exempt
def free_time(request):
    if request.method == 'GET':
        w = WeeklySchedule()
        w.add_block(Day.MONDAY, (0, 30), (1, 0))
        w.add_block(Day.TUESDAY, (0, 45), (2, 30))
        w.add_block(Day.MONDAY, (0, 15), (0, 29))
        return w.to_json_response()
    else:
        return HttpResponse()


url_patterns = [
    url(r'^free-time/$', free_time, name='free_time')
]

