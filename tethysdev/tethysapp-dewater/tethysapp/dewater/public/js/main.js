$(document).ready(function() {
var map;
var wells = [];
var perimeter = [];
var numFeat = [];

function listen() {
map = TETHYS_MAP_VIEW.getMap();

map.on('pointermove', function(evt) {
    if (evt.dragging) return;
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);

    map.getTarget().style.cursor = hit ? 'pointer' :'';
    });
};
function dewater(){
//initialize the variables for the functions to be used
map = TETHYS_MAP_VIEW.getMap();

var wells = [];
var perimeter = [];
var i = 1

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
console.log(wells)
console.log(perimeter)
};

//Create public functions to be called in the controller
app = {dewater: dewater}





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