#!/usr/bin/env node

var fs = require("fs"),
    {createCanvas} = require("canvas"),
    d3_geo = require("d3-geo"),
    d3_array = require("d3-array"),
    d3_interpolate = require("d3-interpolate"),
    geotiff = require("geotiff"),
    topojson = require("topojson"),
    isolines = require("../");


var width = 960,
    height= 500;
    
var name = process.argv[2];

var canvas = createCanvas(width, height),
context = canvas.getContext("2d");

var projection = d3_geo.geoEquirectangular();

var path = d3_geo.geoPath()
    .projection(projection)
    .context(context);

var testData = {
"isolines-simple": {"data": [[0, 0, 1],
           [0, 1, 0],
           [0, 0, 0]],
            "intervals": [0.5]},
"isolines-breaks": {"data": [[5, 5, 5, 5, 5, 5, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 5, 18, 5, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 5, 5, 5, 5, 5, 5]],
            "intervals": [6, 10, 14]}
};

var geoTransform = [-30, 10, 0, 30, 0, -10];



if(name.indexOf("geotiff") === -1){
    var colors = ["#f00", "#00f", "#0f0"];
    var bands = isolines.isolines(testData[name].data, geoTransform, testData[name].intervals);
    bands.features.forEach(function(d, i) {

    context.beginPath();
    context.strokeStyle = colors[i];
    path(d);
    context.stroke();

    
    });
    
} else {
    var tiffData = fs.readFileSync("test/samples/sfctmp.tiff");
    var arrayBuffer = tiffData.buffer.slice(tiffData.byteOffset, tiffData.byteOffset + tiffData.byteLength);
    var tiff = geotiff.parse(arrayBuffer);
    var image = tiff.getImage(); 
    var rasters = image.readRasters();
    var data = new Array(image.getHeight());
    for (var j = 0; j<image.getHeight(); j++){ 
        data[j] = new Array(image.getWidth());
        for (var i = 0; i<image.getWidth(); i++){
            data[j][i] = rasters[0][i + j*image.getWidth()];
        }
    }

    var maxVal = 70.0;
    var minVal = -75.0;

    var intervals = d3_array.range(minVal, maxVal+(maxVal-minVal)/20, (maxVal-minVal)/20);
    var colors = d3_array.ticks(0, 1, intervals.length).map(function(d){return d3_interpolate.interpolateLab(d);});
    geoTransform = [0, 0.500695, 0, 90, 0, -0.5]; //x-interval corrected to match borders

    var bands = isolines.isolines(data, geoTransform, intervals);

    bands.features.forEach(function(d, i) {

    context.beginPath();
    context.strokeStyle = colors[i];
    path(d);
    context.stroke();

    
    
    });

    var topojsonData = JSON.parse(fs.readFileSync("test/samples/world-110m.json", "utf-8"));
    var jsonData = topojson.feature(topojsonData, topojsonData.objects.countries);
    context.beginPath();
    context.strokeStyle = "#000";
    path(jsonData);
    context.stroke();
}





console.warn("↳ test/output/" + name + ".png");
canvas.pngStream().pipe(fs.createWriteStream("test/output/"+name+".png"));