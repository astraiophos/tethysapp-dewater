$(function() {
//  ########################################## Declare variables here ##################################################

var map;
var wells = [];
var perimeter = [];
var mapView = [];
var numFeat = [];
//variables for watertable calculations
var wellx = 0;
var welly = 0;
var wellr = 0;
var deltax = 0;
var deltay = 0;
var H = 0;
var Q = 0;
var hc = 0;
var sum = 0; //for summing q*ln(R/r)
var wtElevation = 0;
//counters for building arrays
var i = 0;
var c = 0;
var counter = 0;
//custom legend functions
var update_legend;
var is_defined;
var clear_legend;

//  #################################### Verify that the user has the necessary variables ##############################

function verify(){
//initialize the variables for the functions to be used
map = TETHYS_MAP_VIEW.getMap();

var wells = [];
var perimeter = [];
i = 0;

H = dwte.value - bedrock.value;
if (H < 0){
    window.confirm("Your desired elevation is lower than the bedrock elevation");
    return;}

H = iwte.value - bedrock.value;
if (H < 0){
    window.confirm("Your initial elevation is lower than the bedrock elevation");
    return;}

H =  iwte.value- dwte.value;
if (H < 0){
    window.confirm("Your desired elevation is higher than the initial elevation");
    return;}

hc = k.value;
if (hc <= 0){
    window.confirm("Hydraulic conductivity must have a positive value, adjust your input.");
    return;}


//this reads the number of features found in the map object and verifies that all of the required features are present
numFeat = map.getLayers().item(1).getSource().getFeatures();
console.log(numFeat.length)
    do  {
        if (map.getLayers().item(1).getSource().getRevision() === 0) {
            window.confirm("You don't have any features, please provide a boundary and well locations.")
            return;}
        if (map.getLayers().item(1).getSource().getFeatures()[i].getGeometry().getType() === 'Point') {
            wells.push(map.getLayers().item(1).getSource().getFeatures()[i].getGeometry().getCoordinates());}
        else if (map.getLayers().item(1).getSource().getFeatures()[i].getGeometry().getType() === 'Polygon') {
            if(perimeter.length === 1){window.confirm("You have more than one Perimeter, delete the extra(s)");
                return;}
            perimeter.push(map.getLayers().item(1).getSource().getFeatures()[i].getGeometry().getCoordinates());}
        i = i + 1
    }
    while (i < numFeat.length);

if (wells.length === 0) {
    window.confirm("You need wells to perform the analysis, please add at least one well.");
    return;
    }
else if (perimeter.length === 0) {
    window.confirm("You need a boundary for your analysis, please add a boundary.");
    return;
    }

// Obtain the map view extents for bounding the grid a second time
mapView = map.getView().calculateExtent(map.getSize());

//console.log(wells);
//console.log(perimeter);
dewater(perimeter,wells,mapView);
};

function isOdd(num) {return !!(num % 2);}

//  #################################### From the input shapes and variables, create a grid ############################

function dewater(p,w,mapView){
var pCoords = p.toString();
var wCoords = w.toString();

var pXCoords = [];
var pYCoords = [];
var wXCoords = [];
var wYCoords = [];
var mapXCoords = [];
var mapYCoords = [];

//Split the coordinate arrays into separate X and Y coordinate arrays

i = 0;
c = 0;
counter = 0;

pCoords = pCoords.split(",");
//console.log(pCoords);
wCoords = wCoords.split(",");
//console.log(wCoords);



// Perimeter coordinates by X and Y
do {
    if (isOdd(i) === false){
        pXCoords[c] = parseFloat(pCoords[i]);
        //console.log(pXCoords[i]);
        i = i+1;
        c = c+1;
        }

    else if (isOdd(i) === true){
        pYCoords[counter] = parseFloat(pCoords[i]);
        //console.log(pYCoords[i]);
        i = i+1;
        counter = counter+1;
        }
}
while (i<10);

//reinitialize counters
i = 0;
c = 0;
counter = 0;

// Well coordinates by X and Y
do{
    if (isOdd(i) === false){
        wXCoords[c] = parseFloat(wCoords[i]);
        //console.log(wXCoords[i]);
        i = i+1;
        c = c+1;
        }

    else if (isOdd(i) === true){
        wYCoords[counter] = parseFloat(wCoords[i]);
        //console.log(wYCoords[i]);
        i = i+1;
        counter = counter+1;
        }
    }
while (i < wCoords.length);

// Map View Extent coordinates

mapXCoords[0] = mapView[0];
mapYCoords[0] = mapView[1];
mapXCoords[1] = mapView[2];
mapYCoords[1] = mapView[3];

//for debugging purposes
//console.log("Well 'x' coordinates " + wXCoords);
//console.log("Well 'y' coordinates " + wYCoords);

//This section defines the cell size based on a percentage for the area selected
//the shortest dimension is what determines the cellsize
var scale = 0.1;
var cellSide = 0.0;

console.log("Getting cellSide");

if (Math.abs(pXCoords[0]-pXCoords[1]) > Math.abs(pYCoords[0]-pYCoords[1])){
    cellSide = Math.abs(pXCoords[0]-pXCoords[1])*scale;}
else if (Math.abs(pXCoords[0]-pXCoords[1]) < Math.abs(pYCoords[0]-pYCoords[1])) {
    cellSide = Math.abs(pYCoords[0]-pYCoords[1])*scale;}
else {
    cellSide = cellSide + Math.abs(pXCoords[0]-pXCoords[1])*scale;}

console.log(cellSide);
//This section constructs the featurecollection polygons defining the water table elevations
//Cells are defined at the corners, water table elevation is defined at the center of the cell

var waterTable = [];
var waterTableRegional = [];
var sum = 0.0;  //This is for summing q*ln(R/r)

console.log("Getting water table");

//  ################################# Build the grid with polygon cells ################################################

// This code builds the grid with the bounding box being the perimeter drawn by the user
//for (long = pXCoords[0]-cellSide; long < pXCoords[2]+cellSide; long += cellSide) {
//    for (lat = pYCoords[0]-cellSide; lat < pYCoords[2]+cellSide; lat += cellSide) {
//        waterTable.push({
//            'type': 'Feature',
//            'geometry': {
//                'type': 'Polygon',
//                'coordinates': [
//                                [   [long,lat],
//                                    [long + cellSide, lat],
//                                    [long + cellSide, lat + cellSide],
//                                    [long, lat + cellSide],
//                                    [long,lat]
//                                ]
//                               ]
//                        },
//                'properties': {
//                    'elevation' : elevationCalc(long,lat,wXCoords,wYCoords,cellSide),
//                }
//                        });
//        }
//    }

// This code builds the grid using the bounding box as the zoomed in view of the user
for (long = mapXCoords[0]-cellSide; long < mapXCoords[1]; long += cellSide) {
    for (lat = mapYCoords[0]-cellSide; lat < mapYCoords[1]; lat += cellSide){
        waterTableRegional.push({
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates':  [
                                 [  [long,lat],
                                    [long + cellSide, lat],
                                    [long + cellSide, lat + cellSide],
                                    [long, lat + cellSide],
                                    [long,lat]
                                 ]
                                ]
                },
                'properties': {
                    'elevation' : elevationCalc(long,lat,wXCoords,wYCoords,cellSide),
                }
            });
        }
    }

//console.log(waterTable);
//console.log(peripheryTable);

//var raster_elev = {
//    'type': 'FeatureCollection',
//    'crs': {
//        'type': 'name',
//        'properties':{
//            'name':'EPSG:4326'
//            }
//    },
//    'features': waterTable
//};
var raster_elev_mapView = {
    'type': 'FeatureCollection',
    'crs': {
        'type': 'name',
        'properties':{
            'name':'EPSG:4326'
            }
    },
    'features': waterTableRegional
};
//addWaterTable(raster_elev,"Water Table Elevations");
addWaterTable(raster_elev_mapView,"Water Table Elevations");
}

//  #################################### Calculate the water elevation of each cell  ###################################

function elevationCalc(long,lat,wXCoords,wYCoords,cellSide) {

wellx = 0;
welly = 0;
wellr = 0;
deltax = 0;
deltay = 0;
H = iwte.value - bedrock.value
wtElevation = 0;

i = 0;
sum = 0;
do {

    wellx = wXCoords[i];
    welly = wYCoords[i];
    Q = q.value/wXCoords.length;

    deltax = Math.abs(long+cellSide/2-wellx);
    deltay = Math.abs(lat+cellSide/2-welly);

    wellr = Math.pow((Math.pow(deltax,2) + Math.pow(deltay,2)),0.5);

    //Make sure that we don't create a complex value for the water table elevation
    if (wellr < Math.exp(Math.log(500)-Math.PI*k.value*Math.pow(H,2)/Q)){
        wellr = Math.exp(Math.log(500)-Math.PI*k.value*Math.pow(H,2)/Q);
        }
    if (Math.log(500/wellr)<0){
        sum = sum;
        }
    else{
        sum = sum + Q*Math.log(500/wellr);
        }
    i = i+1;
    }
while(i < wXCoords.length);

wtElevation = Math.pow((Math.pow(H,2) - sum/(Math.PI*k.value)),0.5)

// for debugging purposes
//console.log(wtElevation);
//
//if (isNaN(wtElevation) === true) {
//    console.log("Check Values");
//    console.log(wellx);
//    console.log(welly);
//    console.log(deltax);
//    console.log(deltay);
//    console.log(wellr);
//    console.log(sum);
//    console.log("End Check Values");
//    }

return wtElevation;
}

//  #################################### Add the new water table raster to the map #####################################

function addWaterTable(raster_elev,titleName){

var getStyleColor;

getStyleColor = function(value) {
    if (value > Number(dwte.value)+Number(dwte.value*0.375))
        return [0,32,229,0.7];       //Blue, Hex:0020E5
    else if (value > Number(dwte.value)+Number(dwte.value*0.125))
        return [1,107,231,0.7];       //Light Blue, Hex:016BE7
    else if (value > Number(dwte.value)+Number(dwte.value*0.25))
        return [0,158,223,0.7];     //Lighter Blue, Hex:009EDF
    else if (value > dwte.value)
        return [0,218,157,0.7];       //Turqoise(ish), Hex:00DA9D
    else if (value > Number(dwte.value)-Number(dwte.value*0.125))
        return [0,255,0,0.7];         //Green
    else if (value > Number(dwte.value)-Number(dwte.value*0.25))
        return [255,255,0,0.7];       //Yellow, Hex:FFFF00
    else if (value > Number(dwte.value)-Number(dwte.value*0.375))
        return [196,87,0,0.7];       //Orange, Hex:C45700
    else
        return [191,0,23, 0.7];           //Red, Hex:BF0017
    };

var defaultStyle = new ol.style.Style({
//    var img = new Image();
//    img.src = '/home/jacobbf1/tethysdev/tethysapp-dewater/tethysapp/dewater/public/images/Dried Cell.png';
//    var pat = context.createPattern(img,"repeat");
//
//    context.fillStyle = pat;
    fill: new ol.style.Fill({
        color: [0,0,0,0.7]
    }),
    stroke: new ol.style.Stroke({
    color: [220,220,220,0.7],
    width: 1
    })
});
//This will be used to cache the style
var styleCache = {};

//the style function returns an array of styles for the given feature and resolution
//Return null to hide the feature
function styleFunction(feature, resolution){
    //get the elevation from the feature properties
    var elevation = feature.get('elevation');
    //if there is no elevation value or it's one we don't recognize,
    //return the default style
    if(!elevation) {
        return [defaultStyle];
        }
    //check the cache and create a new style for the elevation if it's not been created before.
    if(!styleCache[elevation]){
        var style_color = getStyleColor(elevation);
        styleCache[elevation] = new ol.style.Style({
            fill: new ol.style.Fill({
                color: style_color
                }),
            stroke: defaultStyle.stroke
            });
        }
//at this point, the style for the current level is in the cache so return it as an array
    return [styleCache[elevation]];
}

var collection = raster_elev;
var format = new ol.format.GeoJSON();

var vectorSource = new ol.source.Vector({
    features: format.readFeatures(collection,
    {featureProjection:"EPSG:4326"})
    });

var display = true;

var vector = new ol.layer.Image({
        tethys_legend_title: titleName,
        zIndex: 1,
        source: new ol.source.ImageVector({
            source: vectorSource,
            style: styleFunction
        }),
    });

// Make sure that the layer is not already existing, remove it if the layer does exist
map = TETHYS_MAP_VIEW.getMap();
for (i = 0; i < map.getLayers().getProperties().length ; i ++){
    if (map.getLayers().item(i).getProperties().legend_title === titleName)
        map.removeLayer(map.getLayers().item(i));
}
vector.tethys_legend_title = 'Water Table'
map.addLayer(vector);

TETHYS_MAP_VIEW.updateLegend();

map.getLayers().item(1).setZIndex(2)

}


//  #################################### Remove Features via button ####################################################



//Create public functions to be called in the controller
app = {verify: verify}





//document.keyup(function(evt) {
//    if (evt.keyCode === 27) $(map.getInteractions().item(??).setActive(false))})

//$(document).on('keyup', function (evt) {
//    if (evt.keyCode === 27) {
//        console.log('You clicked escape');
//    }
//});

//the drawbox function is the map.getControls().item(11);
//map.getLayers().item(1).getSource().getFeatures(); will aquire the array of features


//function listen() {
//map = TETHYS_MAP_VIEW.getMap();
//
//map.on('pointermove', function(evt) {
//    if (evt.dragging) return;
//    var pixel = map.getEventPixel(evt.originalEvent);
//    var hit = map.hasFeatureAtPixel(pixel);
//
//    map.getTarget().style.cursor = hit ? 'pointer' :'';
//    });
//};

});

