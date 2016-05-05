require(["dojo/dom",
      "dojo/dom-attr",
      "dojo/_base/array",
      "esri/Color",
      "dojo/number",
      "dojo/parser",
      "dijit/registry",

      "esri/config",
      "esri/map",
      "esri/graphic",
      "esri/tasks/GeometryService",
      "esri/tasks/BufferParameters",
      "esri/toolbars/draw",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/Font",
      "esri/symbols/TextSymbol",

      "dijit/layout/BorderContainer",
      "dijit/layout/ContentPane"
  ],
  function(dom, domAttr, array, Color, number, parser, registry, esriConfig, Map, Graphic, GeometryService, BufferParameters, Draw,
              SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Font, TextSymbol)
{

       var map = new Map("map", {
       basemap: "topo",
       center:[-111.5, 40.25],
       zoom: 10
       });



});