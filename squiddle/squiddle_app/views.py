from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def main_page(request):
    test_items = (('first', 'test1'), ('second', 'test2'), ('third', 'test3'), ('fourth', 'test4'))
    return render(request, 'squiddle_app/main_page.html', {'list_items': test_items})
