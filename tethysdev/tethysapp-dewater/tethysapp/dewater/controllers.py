from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from tethys_sdk.gizmos import MapView, MVDraw, MVView, MVLayer, MVLegendClass

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
    # Define view options
    view_options = MVView(
        projection='EPSG:4326',
        center=[-100, 40],
        zoom=3.5,
        maxZoom=18,
        minZoom=2
    )

    # Define drawing options
    drawing_options = MVDraw(
        controls=['Box', 'Point', 'Move', 'Modify'],
        initial='Box',
        output_format='WKT'
    )

    # Define map view options
    map_view_options = MapView(
            height='600px',
            width='100%',
            controls=['ZoomSlider', 'Rotate', 'FullScreen',
                      {'MousePosition': {'projection': 'EPSG:4326'}},
                      {'ZoomToExtent': {'projection': 'EPSG:4326', 'extent': [-130, 22, -65, 54]}}],
            layers=[],
            view=view_options,
            basemap='OpenStreetMap',
            draw=drawing_options,
            legend=True
    )

    context = {'page_id' : '1', 'map_view_options': map_view_options}

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