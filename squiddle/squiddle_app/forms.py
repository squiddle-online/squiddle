import pytz
from django import forms
from django.contrib.auth.forms import UserCreationForm
from timezone_field import TimeZoneFormField
from squiddle_app import models
from django.contrib.auth.models import User


class MemberCreationForm(forms.Form):
    timezone = TimeZoneFormField(choices=[(x, x) for x in pytz.common_timezones])


class GroupCreationForm(forms.Form):
    name = forms.CharField(max_length=32)
    description = forms.CharField(max_length=256, widget=forms.Textarea)
    
    def clean_name(self):
        name = self.cleaned_data['name']
        if len(models.MemberGroup.objects.filter(name=name)):
            raise forms.ValidationError('A group by that name already exists')
        return name
        
    def clean_description(self):
        return self.cleaned_data['description']

class UserEditForm(forms.Form):
        username = forms.CharField(max_length=32)

        def clean_username(self):
            username = self.cleaned_data['username']
            if len(models.User.objects.filter(username=username)):
                raise forms.ValidationError('A User by that name already exists')
            return username
