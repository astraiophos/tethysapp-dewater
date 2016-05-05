from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'dewater/home.html', context)

def tool(request):
    """
    Controller for the dewatering tool
    """
    context = {'page_id' : '1'}

    return render(request, 'dewater/DewateringTool.html', context)

def user(request):
    """
    Controller for the software license page.
    """
    context = {'page_id' : '2'}

    return render(request, 'dewater/user.html', context)

def tech(request):
    """
    Controller for the software license page.
    """
    context = {'page_id' : '3'}

    return render(request, 'dewater/tech.html', context)

def license(request):
    """
    Controller for the software license page.
    """
    context = {'page_id' : '4'}

    return render(request, 'dewater/license.html', context)