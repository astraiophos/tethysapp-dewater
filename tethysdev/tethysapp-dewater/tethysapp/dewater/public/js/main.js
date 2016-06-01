$(document).ready(function() {
var map;
var wells = [];
var perimeter = [];
var numFeat = [];
//counters for building arrays
var i = 0;
var c = 0;

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

var i = 0;

pCoords = pCoords.split(",");
console.log(pCoords);
wCoords = wCoords.split(",");
console.log(wCoords);

do {
    if (isOdd(i) === false){
        pXCoords[i] = (pCoords[i]);
        console.log(pXCoords[i]);
        i = i+1;
        }

    else if (isOdd(i) === true){
        pYCoords[i] = (pCoords[i]);
        console.log(pYCoords[i]);
        i = i+1;
        }
}
while (i<10);

//reinitialize counter
i = 0;

do{
    if (isOdd(i) === false){
        wXCoords[i] = (wCoords[i]);
        console.log(wXCoords[i]);
        i = i+1;
        }

    else if (isOdd(i) === true){
        wYCoords[i] = (wCoords[i]);
        console.log(wYCoords[i]);
        i = i+1;
        }
    }
while (i < wCoords.length);

//This section defines the cell size based on a percentage for the area selected
//the shortest dimension is what determines the cellsize
var percent = 0.1;
var cellSide = 0.0;

if (abs(pXCoords[0]-pXCoords[1]) > abs(pYCoords[0]-pYCoords[1])){
    cellSide = abs(pXCoords[0]-pXCoords[1])*percent;}
else if (abs(pXCoords[0]-pXCoords[1]) < abs(pYCoords[0]-pYCoords[1])) {
    cellSide = abs(pYCoords[0]-pYCoords[1])*percent;}
else {
    cellSide = abs(pXCoords[0]-pXCoords[1])*percent;}

//This section constructs the array of 'z' values defining the water table elevations
//Cells are defined at the top left corner
var waterTable = [];

i = 0;
c = 0;

do {
    }

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