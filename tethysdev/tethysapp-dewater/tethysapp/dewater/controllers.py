from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from tethys_sdk.gizmos import *

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
        center=[-111.64925, 40.24721],
        zoom=15.5,
        maxZoom=22,
        minZoom=2
    )

    # Define drawing options
    drawing_options = MVDraw(
        controls=['Box','Modify', 'Point', 'Move'],
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

    # Define Message Box for user feedback
    message_box = MessageBox(name='sampleModal',
                         title='Message Box Title',
                         message='Congratulations! This is a message box.',
                         dismiss_button='Nevermind',
                         affirmative_button='Proceed',
                         width=400,
                         affirmative_attributes='href=javascript:void(0);')

    # Define text input boxes for UI
    k = TextInput(display_text='Average Hydraulic Conductivity',
                  name='k',
                  initial='0.000231',
                  placeholder='e.g. 0.000231',
                  prepend='k =',
                  append='[ft/s]',
                  )
    bedrock = TextInput(display_text='Bedrock Elevation',
                  name='bedrock',
                  initial='0',
                  placeholder='e.g. 0',
                  prepend='Elev. =',
                  append='[ft]',
                  )
    iwte = TextInput(display_text='Initial Water Table Elevation',
                  name='iwte',
                  initial='100',
                  placeholder='e.g. 100',
                  prepend='Elev. =',
                  append='[ft]',
                  )
    q = TextInput(display_text='Total Combined Flow',
                  name='q',
                  initial='2',
                  placeholder='e.g. 2',
                  prepend='Q =',
                  append='[cfs]',
                  )
    dwte = TextInput(display_text='Desired Water Table Elevation',
                  name='dwte',
                  initial='70',
                  placeholder='e.g. 70',
                  prepend='Elev. =',
                  append='[ft]',
                  )

    execute = Button(display_text='Calculate Water Table Elevations',
                     attributes='onclick=app.verify()',
                     submit=True,
                     classes='btn-success')

    instructions = Button(display_text='Instructions',
                     attributes='onclick=app.dewater()',
                     submit=True)

    context = { 'page_id' : '1', 'map_view_options': map_view_options,
                'message_box':message_box,
                'k':k,
                'bedrock':bedrock,
                'iwte':iwte,
                'q':q,
                'dwte':dwte,
                'execute':execute,
                'instructions':instructions}

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