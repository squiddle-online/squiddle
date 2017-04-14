from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm
from .forms import *


def home(request):
    return redirect('view_schedules')


@login_required
def view_notifications(request):
    return render(request, 'view_notifications.html')


@login_required
def edit_free_time(request):
    return render(request, 'edit_free_time.html', { 'form': TimeBlockForm()})


@login_required
def create_group(request):
    return render(request, 'create_group.html')


@login_required
def manage_groups(request):
    return render(request, 'manage_groups.html')


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


