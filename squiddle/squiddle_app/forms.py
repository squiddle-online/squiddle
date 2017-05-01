import pytz
from django import forms
from timezone_field import TimeZoneFormField


class MemberCreationForm(forms.Form):
    timezone = TimeZoneFormField(choices=[(x, x) for x in pytz.common_timezones])

