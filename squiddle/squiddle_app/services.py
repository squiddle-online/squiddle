from django.conf.urls import url
from squiddle_app.rest_data import *


def free_time(request):
    w = WeeklySchedule()
    w.add_block(Day.MONDAY, (0, 30), (1, 0))
    return w.to_json_response()


url_patterns = [
    url(r'^free-time/$', free_time, name='free_time')
]

