from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, HttpResponseBadRequest
from .forms import *
from .models import *


def home(request):
    return redirect('view_schedules')


@login_required
def view_notifications(request):
    return render(request, 'view_notifications.html')


@login_required
def edit_free_time(request):
    return render(request, 'edit_free_time.html')


@login_required
def create_group(request):
    if request.method == 'POST':
        group_form = GroupCreationForm(request.POST)
        if group_form.is_valid():
            name = group_form.clean_name()
            description = group_form.clean_description()

            new_group = MemberGroup(name=name, description=description, owner=request.user.member)
            new_group.save()
            return redirect('manage_groups')
        else:
            return render(request, 'create_group.html', context={'form': group_form})
    else:
        group_form = GroupCreationForm()
        return render(request, 'create_group.html', context={'form': group_form})


@login_required
def manage_groups(request):
    if request.method == 'POST':
        return HttpResponseBadRequest()

    return render(request, 'manage_groups.html', context={'group_edit_form': GroupCreationForm()})


@login_required
def view_schedules(request):
    return render(request, 'view_schedules.html')


@login_required
def profile(request):
    return render(request, 'profile.html')


def signup(request):
    if request.method == 'POST':
        user_form = UserCreationForm(request.POST)
        member_form = MemberCreationForm(request.POST)
        if user_form.is_valid() and member_form.is_valid():
            user = user_form.save()
            raw_password = user_form.clean_password2()
            user = authenticate(username=user.username, password=raw_password)
            user.refresh_from_db()
            user.member.timezone = member_form.cleaned_data['timezone']
            user.save()
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'signup.html', context={'user_form': user_form, 'member_form': member_form})
    else:
        if request.user.is_authenticated():
            logout(request)
        user_form = UserCreationForm()
        member_form = MemberCreationForm()
        return render(request, 'signup.html', context={'user_form': user_form, 'member_form': member_form})


