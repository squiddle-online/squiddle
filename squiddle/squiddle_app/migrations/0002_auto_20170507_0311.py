# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-07 08:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('squiddle_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='member',
            name='groups',
            field=models.ManyToManyField(blank=True, related_name='members', to='squiddle_app.MemberGroup'),
        ),
    ]
