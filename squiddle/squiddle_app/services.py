from django.conf.urls import url
from django.http import JsonResponse


def free_time(request):
    free_time_json = {"foo": "bar"}
    return JsonResponse(free_time_json)


url_patterns = [
    url(r'^free-time/$', free_time, name='free_time')
]

