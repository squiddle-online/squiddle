from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from squiddle_app import rest_data
from squiddle_app import models
from django.core.exceptions import *
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
def get_notifications(request):
    if request.method == 'GET':
        notification_list = rest_data.NotificationList()
        for n in models.Notification.objects.filter(receiver=request.user.member):
            notification_list.add(n.to_rest_data())
        return notification_list.to_json_response()

    return HttpResponseBadRequest()


@csrf_exempt
def add_notification(request):
    if request.method == 'POST':
        return HttpResponse()

    return HttpResponse()


@csrf_exempt
def remove_notification(request, pk):
    if request.method == 'GET':
        return HttpResponseBadRequest()

    try:
        models.Notification.objects.get(pk=pk, receiver=request.user.member).delete()
    except ObjectDoesNotExist:
        return HttpResponseBadRequest("Notification either does not exist or doesn't belong to the current user.")

    return HttpResponse()


@csrf_exempt
def accept_invitation(request, pk):
    if request.method == 'GET':
        return HttpResponseBadRequest()

    member = request.user.member
    try:
        notification = models.Notification.objects.get(pk=pk, type=models.Notification.Type.INVITATION,
                                                       receiver=member)
        group = models.MemberGroup.objects.get(pk=notification.data['group_id'])
    except ObjectDoesNotExist:
        return HttpResponseBadRequest('Invitation does not exist or is not the correct type.')

    # Make sure not to add members twice.
    if group.members.filter(pk=member.pk):
        return HttpResponse()

    group.members.add(member)
    confirmation = models.Notification.create_invitation_accepted(sender=member, receiver=group.owner)
    confirmation.save()

    return HttpResponse()


@csrf_exempt
def decline_invitation(request, pk):
    if request.method == 'GET':
        return HttpResponseBadRequest()

    member = request.user.member
    try:
        notification = models.Notification.objects.get(pk=pk, type=models.Notification.Type.INVITATION,
                                                       receiver=member)
        group = models.MemberGroup.objects.get(pk=notification.data['group_id'])
    except ObjectDoesNotExist:
        return HttpResponseBadRequest()

    notice = models.Notification.create_invitation_declined(sender=member, receiver=group.owner)
    notice.save()

    return HttpResponse()


@csrf_exempt
def users(request):
    if request.method == 'GET':
        return HttpResponse()


url_patterns = [
    url(r'^free-time/$', free_time, name='free_time'),
    url(r'^notifications/get/$', get_notifications, name='get_notifications'),
    url(r'^notifications/add/$', remove_notification, name='add_notification'),
    url(r'^notifications/remove/(\d+)$', remove_notification, name='remove_notification'),
    url(r'^notifications/accept-invitation/(\d+)$', accept_invitation, name='accept_invitation'),
    url(r'^notifications/decline-invitation/(\d+)$', decline_invitation, name='decline_invitation'),
    url(r'^users/$', users, name='users')
]
