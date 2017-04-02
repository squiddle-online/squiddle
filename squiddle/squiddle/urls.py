"""squiddle URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from squiddle_app import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.home, name='home'),
    url(r'^notifications/', views.view_notifications, name='view_notifications'),
    url(r'^edit_free_time/', views.edit_free_time, name='edit_free_time'),
    url(r'^create_group/', views.create_group, name='create_group'),
    url(r'^manage_groups/', views.manage_groups, name='manage_groups'),
    url(r'^view_schedules/', views.view_schedules, name='view_schedules'),
    url(r'^profile/', views.profile, name='profile'),
    url(r'^signup/', views.signup, name='signup'),

    url(r'^login/', auth_views.login, {'template_name' : 'login.html'}, name='login'),
    url(r'^logout/', auth_views.logout_then_login, name='logout'),
]
