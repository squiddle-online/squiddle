from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm


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
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            raw_password = form.clean_password2()
            user = authenticate(username=user.username, password=raw_password)
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'signup.html', context = {'form' : form})
    else:
        if request.user.is_authenticated():
            logout(request.user)
        form = UserCreationForm()
        return render(request, 'signup.html', context = {'form' : form})


