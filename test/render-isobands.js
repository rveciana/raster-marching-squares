#!/usr/bin/env node

var fs = require("fs"),
    Canvas = require("canvas"),
    d3_geo = require("d3-geo"),
    isobands = require("../");


var width = 960,
    height= 500
    name = process.argv[2];

var canvas = new Canvas(width, height),
context = canvas.getContext("2d");

var projection = d3_geo.geoEquirectangular();

var path = d3_geo.geoPath()
    .projection(projection)
    .context(context);

testData = {
"isobands-simple": {"data": [[0, 0, 0],
           [0, 1, 0],
           [0, 0, 0]],
            "intervals": [0.5, 1]},
"isobands-breaks": {"data": [[5, 5, 5, 5, 5, 5, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 5, 18, 5, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 5, 5, 5, 5, 5, 5]],
            "intervals": [6, 10, 14]}
};

var geoTransform = [-30, 10, 0, 30, 0, -10];
var bands = isobands.isobands(testData[name]['data'], geoTransform, testData[name]['intervals']);

var colors = ["#f00", "#00f", "#0f0"]

var path2 = d3_geo.geoPath()
    .projection(projection);

bands.features.forEach(function(d, i) {
    context.beginPath();
    context.fillStyle = colors[i];
    context.strokeStyle = colors[i];
    path(d);
    context.fill();
});

console.warn("↳ test/output/" + name + ".png");
canvas.pngStream().pipe(fs.createWriteStream("test/output/"+name+".png"));
