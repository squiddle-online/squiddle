import pytz
from django import forms
from timezone_field import TimeZoneFormField


class MemberCreationForm(forms.Form):
    timezone = TimeZoneFormField(choices=[(x, x) for x in pytz.common_timezones])


class TimeBlockForm(forms.Form):
    start_hour = forms.IntegerField(min_value=0, max_value=23, required=True)
    start_minute = forms.IntegerField(min_value=0, max_value=59, required=True)
    duration_hour = forms.IntegerField(min_value=0, max_value=24, required=True)
    duration_minute = forms.IntegerField(min_value=0, max_value=59, required=True)

    def clean_duration_hour(self):
        cd = self.cleaned_data
        duration_hour = cd['duration_hour']
        if cd['start_hour'] + duration_hour > 24:
            raise forms.ValidationError('Time-Blocks may not exceed day boundaries.')
        return duration_hour

    def clean_duration_minute(self):
        cd = self.cleaned_data
        duration_minute = cd['duration_minute']
        if cd['start_hour'] + cd['start_minute']/60 + cd['duration_hour'] + duration_minute/60 > 24:
            raise forms.ValidationError('Time-Blocks may not exceed day boundaries.')

