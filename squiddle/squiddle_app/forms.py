import pytz
from django import forms
from timezone_field import TimeZoneFormField
from squiddle_app import models


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
