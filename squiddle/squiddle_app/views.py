from django.shortcuts import render
from django.http import HttpResponse


def full_page(request):
    return render(request, 'squiddle_app/full_page.html')


