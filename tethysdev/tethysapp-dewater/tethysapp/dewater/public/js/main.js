$(document).ready(function() {
var map;
var wells = [];
var perimeter = [];
var numFeat = [];
//counters for building arrays
var i = 0;
var c = 0;
var counter = 0;

function listen() {
map = TETHYS_MAP_VIEW.getMap();

map.on('pointermove', function(evt) {
    if (evt.dragging) return;
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);

    map.getTarget().style.cursor = hit ? 'pointer' :'';
    });
};
function verify(){
//initialize the variables for the functions to be used
map = TETHYS_MAP_VIEW.getMap();

var wells = [];
var perimeter = [];
i = 1;

//this reads the number of features found in the map object and verifies that all of the required features are present
numFeat = map.getLayers().item(1).getSource().getFeatures();
console.log(numFeat.length)
    do  {
    if (map.getLayers().item(1).getSource().getRevision() === 0) {
        console.log("You don't have any features, please provide the boundary and the well locations.")
        break;}
    if (map.getLayers().item(1).getSource().getFeatureById(i).getGeometry().getType() === 'Point') {
        wells.push(map.getLayers().item(1).getSource().getFeatureById(i).getGeometry().getCoordinates());}
    else if (map.getLayers().item(1).getSource().getFeatureById(i).getGeometry().getType() === 'Polygon') {
        if(perimeter.length === 1){alert("You have more than one Perimeter, delete the extra(s)");
            break;}
        perimeter.push(map.getLayers().item(1).getSource().getFeatureById(i).getGeometry().getCoordinates());}
    i = i + 1
    }
    while (i < numFeat.length+1);
console.log(wells);
console.log(perimeter);
dewater(perimeter,wells);
};

function isOdd(num) {return !!(num % 2);}

function dewater(p,w){
var pCoords = p.toString();
var wCoords = w.toString();

var pXCoords = [];
var pYCoords = [];
var wXCoords = [];
var wYCoords = [];

//Split the coordinate arrays into separate X and Y coordinate arrays

i = 0;
c = 0;
counter = 0;

pCoords = pCoords.split(",");
console.log(pCoords);
wCoords = wCoords.split(",");
console.log(wCoords);

do {
    if (isOdd(i) === false){
        pXCoords[c] = parseFloat(pCoords[i]);
        console.log(pXCoords[i]);
        i = i+1;
        c = c+1;
        }

    else if (isOdd(i) === true){
        pYCoords[counter] = parseFloat(pCoords[i]);
        console.log(pYCoords[i]);
        i = i+1;
        counter = counter+1;
        }
}
while (i<10);

//reinitialize counters
i = 0;
c = 0;

do{
    if (isOdd(i) === false){
        wXCoords[c] = parseFloat(wCoords[i]);
        console.log(wXCoords[i]);
        i = i+1;
        c = c+1;
        }

    else if (isOdd(i) === true){
        wYCoords[counter] = parseFloat(wCoords[i]);
        console.log(wYCoords[i]);
        i = i+1;
        counter = counter+1;
        }
    }
while (i < wCoords.length);

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
var sum = 0.0;  //This is for summing q*ln(R/r)

console.log("Getting water table");

for (long = pXCoords[0]-cellSide; long < pXCoords[1]+cellSide; long += cellSide) {
    for (lat = pYCoords[0]-cellSide; lat < pYCoords[1]+cellSide; lat += cellSide) {
        waterTable.push({
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                                [   [long,lat],
                                    [long + cellSide, lat],
                                    [long + cellSide, lat + cellSide],
                                    [long, lat + cellSide],
                                    [long,lat]
                                ]
                               ]
                        },
                'properties': {
                    'elevation' : 100,
                }
                        });
        console.log("Added a feature");
        }
    }


var raster_elev = {
    'type': 'FeatureCollection',
    'crs': {
        'type': 'name',
        'properties':{
            'name':'EPSG:4326'
            }
    },


};
}


//Create public functions to be called in the controller
app = {dewater: dewater,
        verify: verify}





//document.keyup(function(evt) {
//    if (evt.keyCode === 27) $(map.getInteractions().item(??).setActive(false))})

//$(document).on('keyup', function (evt) {
//    if (evt.keyCode === 27) {
//        console.log('You clicked escape');
//    }
//});

//the drawbox function is the map.getControls().item(11);
//map.getLayers().item(1).getSource().getFeatures(); will aquire the array of features
});