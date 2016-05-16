var map = TETHYS_MAP_VIEW.getMap();



//document.keyup(function(evt) {
//    if (evt.keyCode === 27) $(map.getInteractions().item(??).setActive(false))})

//$(document).on('keyup', function (evt) {
//    if (evt.keyCode === 27) {
//        console.log('You clicked escape');
//    }
//});

//the drawbox function is the map.getControls().item(11);
//map.getLayers().item(1).getSource().getFeatures(); will aquire the array of features

var wells = [];
var perimeter = [[100000000000000,100000000000000]];

function dewater(){
console.log(k.value)
    do until map.getLayers().item(1).getSource().getFeatureById(1).getGeometry().getType() = null {
    if (map.getLayers().item(i).getSource().getFeatureById(i).getGeometry().getType() === 'Point') {
        wells.push(map.getLayers().item(i).getSource().getFeatureById(i).getGeometry().getCoordinates());}
    else if (map.getLayers().item(1).getSource().getFeatureById(1).getGeometry().getType() === 'Polygon') {
        if(perimeter != [[100000000000000,100000000000000]]){alert("You have more than one Perimeter, delete the extra(s)");
            break;}
        perimeter.push(map.getLayers().item(i).getSource().getFeatureById(i).getGeometry().getCoordinates());}
    }
};

//Create public functions to be called in the controller
app = {dewater: dewater}