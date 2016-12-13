[![Build Status](https://travis-ci.org/rveciana/d3-marching-squares.svg?branch=master)](https://travis-ci.org/rveciana/d3-marching-squares)

Marching squares isobands and isolines ready for using along with d3 maps.

The marching squares algorithm code is taken from the [MarchingSquares.js](https://github.com/RaumZeit/MarchingSquares.js) project by [Ronny Lorenz](https://github.com/RaumZeit), adapted to work with nodejs.

INSTALL
-------

Using nodejs:

    npm install raster-marching-squares

From the browser:

Download https://github.com/rveciana/raster-marching-squares/blob/master/build/d3-marching-squares.min.js

USAGE
-----

    var intervals = [0, 5, 10, 15, 20, 25, 30, 35, 40];
    var bands = rastertools.isobands(rasterData, geoTransform, intervals);
    var lines = rastertools.isolines(rasterData, geoTransform, intervals);

* *rasterData* is a 2D array with the values
* *geoTransform* is an array following the conventions of the [GDAL data model](http://www.gdal.org/gdal_datamodel.html)

EXAMPLES
--------

* Isolines with labels: http://bl.ocks.org/rveciana/bef48021e38a77a520109d2088bff9eb
* Simple isobands: http://bl.ocks.org/rveciana/de0bd586eafd7fcdfe29227ccbdcd511
